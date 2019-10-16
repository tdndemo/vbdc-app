(function (_, $) {

    var MODEL_TYPE = {
        OBJECT: "OBJECT",
        ID: "ID",
    };
    var MODEL_SET_TYPE = {
        // Nếu modelType là object thì model object vẫn giữ nguyên,
        // chỉ cập nhật property.
        // Chỉ có tác dụng khi modelType === 'object'.
        FILL: "FILL",
        // Thay thế hoàn toàn model object bằng object mới.
        REPLACE: "REPLACE",
    };

    angular.module("vbdc-app").directive("peoplePicker", [
        "$q", "spUserService",
        function ($q, spUserService) {
            var context = {
                $q: $q,
                spUserService: spUserService,
            };
            return {            
                restrict: "E",
                templateUrl: function () {
                    return "$app/00.directives/people.picker/PeoplePicker.html";
                }(),
                require: "?ngModel",
                compile: getCompile(context),
                scope: {
                    sharepointGroupId: "@",
                    onUsersChanged: "=",
                    multiSelect: "=",
                    controlWidth: "@",
                    modelType: "@",
                    modelSetType: "@",
                    principalAccountType: "@" //'User,DL,SecGroup,SPGroup'
                }
            };
        }
    ]);

    function getCompile(context) {
        return function compile(element, attrs) {
            var defaults = {
                modelType: MODEL_TYPE.OBJECT,
                modelSetType: MODEL_SET_TYPE.FILL,
                principalAccountType: "User,DL,SecGroup,SPGroup",
                controlWidth: "100%",
            };

            _.defaults(attrs, defaults);

            return getLink(context);
        }
    }

    function getLink(context) {
        var spUserService = context.spUserService;
        var $q = context.$q;

        return {
            pre: preLink
        }

        function preLink(scope, element, attrs, modelCtrl) {
            var picker = function createPicker() {
                var id = _.uniqueId("INTERNAL_PEOPLE_PICKER_")
                element.find(".people-picker").attr("id", id);
                initializePeoplePicker(id, {
                    multiple: attrs.multiSelect === "true",
                    width: attrs.controlWidth,
                    principalAccountType: attrs.principalAccountType,
                    sharepointGroupId: scope.sharepointGroupId
                });

                return SPClientPeoplePicker.SPClientPeoplePickerDict[String.format("{0}_TopSpan", id)];
            }();
            var oldIds = [], // Dùng để so sánh xem có nên ensure user hay không.
                lastUsers = [], // Dùng để lưu giá trị users sau khi đã được ensure.
                isClearingPeople = false; // Đánh dấu khi nào hàm clearAllPeople() đang được gọi.

            if (modelCtrl) {
                //#region View => Model
                // 1. View => Model. (array order).
                picker.OnUserResolvedClientScript = function (pickerId, people) {
                    // Nếu đang xóa user để gán lại $modelValue mới thì không cần xét.
                    if (isClearingPeople) return;
                    people = !_.isArray(people) ? [people] : people;

                    $q.when()
                        .then(function () {
                            return $q.all(_.map(people, function (person) {
                                if (person.EntityType === "User" || person.EntityType == "FormsRole" || person.EntityType == "SecGroup"
                                    || _.get(person.EntityData, "PrincipalType") == "User" || _.get(person.EntityData, "PrincipalType") == "FormsRole"
                                    ) {
                                    return spUserService.ensureUser(person.Key);
                                }
                                //else if (person.EntityType == "FormsRole") {
                                //    return {
                                //        Id: _.parseInt(_.get(person, "EntityData.SPGroupID")),
                                //        Title: _.get(person, "DisplayText"),
                                //        Email: _.get(person, "EntityData.Email"),
                                //        PrincipalType: "DistributionGroup",
                                //    };
                                //}
                                else {
                                    var finalId = _.parseInt(_.get(person, "EntityData.SPGroupID"));
                                    if (!finalId) {
                                        finalId = _.parseInt(_.get(person, "EntityData.SPUserID"));
                                    }
                                    return {
                                        Id: finalId,
                                        Title: _.get(person, "EntityData.AccountName"),
                                        PrincipalType: _.get(person, "EntityData.PrincipalType"),
                                    };
                                }
                            }));
                        })
                        .then(function (users) {
                            setModelValue(users);
                        });
                };

                // 1.1. Convert user array (get from EnsureUser) to result (Object/Id).
                modelCtrl.$parsers.push(function (viewValue) {
                    var result = null,
                        users = viewValue,
                        objectType = isObjectType();

                    if (scope.multiSelect) {
                        result = _.reduce(users, function (memo, user) {
                            if (objectType) {
                                memo.push(user);
                            } else {
                                memo.push(user.Id);
                            }
                            return memo;
                        }, []);
                    } else {
                        var user = _.first(users);
                        if (user) {
                            result = objectType ? user : _.get(user, "Id");
                        } else {
                            // Phải gán null ko cái hàm trên nó gán = undefined :v.
                            result = null;
                        }
                    }

                    return result;
                });

                // 1.2. Xử lý modelSetType.
                modelCtrl.$parsers.push(function (viewValue) {
                    if (isObjectType() && isFillModelSetType()) {
                        if (scope.multiSelect) {
                            if (_.isArray(modelCtrl.$modelValue)) {
                                modelCtrl.$modelValue.length = 0;
                                _.forEach(viewValue, function (value) {
                                    modelCtrl.$modelValue.push(value);
                                });
                            }
                        } else {
                            viewValue = _.defaults(viewValue || {}, {
                                Id: null,
                                Title: null,
                            });
                            _.extend(modelCtrl.$modelValue, viewValue);
                        }

                        return modelCtrl.$modelValue;
                    }

                    return viewValue;
                });

                // 1.3. Gan lai oldIds
                modelCtrl.$parsers.push(function (viewValue) {
                    if (_.isArray(viewValue)) {
                        oldIds = _.clone(viewValue);
                    } else {
                        oldIds = !!viewValue ? [viewValue] : [];
                    }
                    return viewValue;
                });
                //#endregion

                //#region Model => View
                // 2. Model => View. (reverse array order).
                modelCtrl.$render = function () {
                    var newIds = modelCtrl.$viewValue;
                    if (!areSame(oldIds, newIds)) {
                        oldIds = newIds;
                        clearAllPeople();

                        if (newIds.length > 0) {
                            if (scope.principalAccountType && (scope.principalAccountType.toLowerCase() === "spgroup")) {
                                _.forEach(newIds, function (id) {
                                    spUserService
                                        .getGroup(id)
                                        .then(function (group) {
                                            picker.AddUnresolvedUser({
                                                Key: group.Title,
                                            }, true);
                                            //picker.AddUserKeys(group.Title);
                                        })
                                        .catch(function (error) {
                                            console.error(error);
                                        });
                                });
                            } else {
                                _.forEach(newIds, function (id) {
                                    spUserService
                                        .getUser(id)
                                        .then(function (user) {
                                            //picker.AddUnresolvedUser({
                                            //    Key: user.LoginName,
                                            //}, true);
                                            //picker.AddUserKeys(user.LoginName);
                                            if (_.get(user, "LoginName.length") > 0) {
                                                picker.AddUserKeys(user.LoginName.slice(user.LoginName.lastIndexOf("|") + 1));
                                            } else {
                                                spUserService
                                                    .getGroup(id)
                                                    .then(function (group) {
                                                        picker.AddUnresolvedUser({
                                                            Key: group.Title,
                                                        }, true);
                                                        //picker.AddUserKeys(group.Title);
                                                    })
                                                    .catch(function (error) {
                                                        console.error(error);
                                                    });
                                            }

                                        })
                                        .catch(function (error) {
                                            // not handle yet.
                                            console.error(error);
                                        });
                                });
                            }
                        } else {
                            setModelValue([]);
                        }
                    }
                };

                // 2.1. Convert to id array.
                modelCtrl.$formatters.unshift(function (modelValue) {
                    // 2 modes:
                    //  - single: Id or { Id, Title }.
                    //  - multiple: [Id] or [{Id, Title }].
                    var model = getModelValue();
                    var ids = null;
                    if (model && scope.modelType) {
                        switch (scope.modelType.toUpperCase()) {
                            case MODEL_TYPE.OBJECT:
                                ids = !scope.multiSelect
                                    ? [model.Id]
                                    : _.map(model, function (value) {
                                        return value.Id;
                                    });
                                break;
                            case MODEL_TYPE.ID:
                                ids = !scope.multiSelect ? [model] : model;
                                break;
                        }
                    }

                    return _.compact(ids);
                });
                //#endregion

                //#region ViewChangeListeners
                modelCtrl.$viewChangeListeners.push(function () {
                    onUsersChanged(lastUsers);
                });
                //#endregion
            }

            function onUsersChanged(users) {
                if (_.isFunction(scope.onUsersChanged)) {
                    scope.onUsersChanged(users);
                }
            }

            function getModelValue() {
                return modelCtrl && modelCtrl.$modelValue;
            }

            function setModelValue(users) {
                lastUsers = users;
                modelCtrl.$setViewValue(users);
            }

            function isObjectType() {
                return scope.modelType && scope.modelType.toUpperCase() === MODEL_TYPE.OBJECT;
            }

            function isFillModelSetType() {
                return scope.modelSetType && scope.modelSetType.toUpperCase() === MODEL_SET_TYPE.FILL;
            }

            function areSame(oldIds, newIds) {
                return _.difference(oldIds, newIds).length === 0 &&
                    _.difference(newIds, oldIds).length === 0;
            }

            function clearAllPeople() {
                isClearingPeople = true;
                while (picker.HasResolvedUsers()) {
                    picker.DeleteProcessedUser();
                }
                isClearingPeople = false;
            }
        }
    }

    // Render and initialize the client-side People Picker.
    function initializePeoplePicker(peoplePickerElementId, settings) {
        var defaults = {
            multiple: false,
            width: "100%",
        };
        settings = _.defaults(settings || {}, defaults);

        var principalAccountType = 'User,DL,SecGroup,SPGroup';
        if (settings.principalAccountType) {
            principalAccountType = settings.principalAccountType;
        }

        // Create a schema to store picker properties, and set the properties.
        var schema = {};
        schema['PrincipalAccountType'] = principalAccountType;
        schema['SearchPrincipalSource'] = 15;
        schema['ResolvePrincipalSource'] = 15;
        schema['AllowMultipleValues'] = settings.multiple;
        schema['MaximumEntitySuggestions'] = 50;
        schema['Width'] = settings.width;

        schema['SharePointGroupID'] = settings.sharepointGroupId;
        // Render and initialize the picker. 
        // Pass the ID of the DOM element that contains the picker, an array of initial
        // PickerEntity objects to set the picker value, and a schema that defines
        // picker properties.
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
    }

})(_, jQuery);