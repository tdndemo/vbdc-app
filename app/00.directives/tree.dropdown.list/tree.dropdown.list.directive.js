(function (global, angular, $, guid, _) {
    angular.module("vbdc-app").directive("treeDropdownList", [
        function () {
            return {
                restrict: "E",
                templateUrl: "$app/00.directives/tree.dropdown.list/tree.dropdown.list.template.html",
                require: "?ngModel",
                scope: {
                    multiSelect: "=",
                    dataSource: "=",
                    noCheckNotes: "=",
                    mode: "@",
                },
                link: function ($scope, element, attr, modelCtrl) {
                    _.defer(function () {
                        initControl($scope, element, attr, modelCtrl);
                    });

                    $scope.$watch("dataSource", function (newValue, oldValue) {
                        if (newValue && newValue.length > 0) {
                            initControl($scope, element, attr, modelCtrl);
                        }
                    }, true);
                    $scope.$watch("fieldValue", function (newValue, oldValue) {
                        if (_.get($scope, "mode") === "id") {
                            modelCtrl.$setViewValue(newValue);
                        } else {
                            var returnValues = [];
                            _.forEach(newValue, function (item) {
                                returnValues.push(_.mapKeys(item, function (value, key) {
                                    if (key == "id") {
                                        return "Code";
                                    } else if (key == "pId") {
                                        return "ParentCode";
                                    } else if (key == "name") {
                                        return "Title";
                                    } else {
                                        return key;
                                    }
                                }));
                            });
                            modelCtrl.$setViewValue(returnValues);
                        }
                        initControl($scope, element, attr, modelCtrl);
                    }, true);

                    modelCtrl.$render = function () {
                        $scope["fieldValue"] = modelCtrl.$viewValue;
                    };
                },
                controller: ["$scope", function ($scope) {
                    var ctrlID = null;
                    $scope.getUNID = function () {
                        if (!ctrlID)
                            ctrlID = guid();
                        return ctrlID;
                    };

                    $scope.setSelectedItems = function (ctrlID, seletedOptions, dataSource, updateModel) {
                        if (!dataSource) {
                            var tmp = _.cloneDeep($scope.dataSource);
                            dataSource = [];
                            _.forEach(tmp, function (item) {
                                dataSource.push(_.mapKeys(item, function (value, key) {
                                    if (key == "Code") {
                                        return "id";
                                    } else if (key == "ParentCode") {
                                        return "pId";
                                    } else if (key == "Title") {
                                        return "name";
                                    } else {
                                        return key;
                                    }
                                }));
                            });
                        }

                        var chosenOptions = [];
                        chosenOptions = chosenOptions.concat(_.filter(dataSource, function (item) {
                            return _.some(seletedOptions, ["id", item.id]);
                        }));

                        var optionsHtml = "";
                        if (_.get(seletedOptions, "length") > 0) {
                            for (var i = 0; i < seletedOptions.length; i++) {
                                optionsHtml += "<div class='tree-dropdown-selected-item'>" +
                                                    _.get(seletedOptions[i], "name") +
                                                    "<a tabindex='-1' " +
                                                        "val = '" + $.trim(seletedOptions[i].id) + "' " +
                                                        "class='tree-dropdown-remove-item close' " +
                                                        "href='javascript:;'>" +
                                                    "</a>" +
                                                "</div>";
                            }
                        }
                        $("#DropdownView_" + ctrlID).html(optionsHtml);

                        if (updateModel) {
                            $scope.$apply(function () {
                                if (_.get($scope, "mode") === "id") {
                                    $scope["fieldValue"] = _.get(_.head(chosenOptions), "id");
                                } else {
                                    $scope["fieldValue"] = chosenOptions;
                                }
                            });
                        }

                        if ($('#DropdownContainer_' + ctrlID + ' .tree-dropdown-remove-item').length > 0) {
                            $('#DropdownContainer_' + ctrlID + ' .tree-dropdown-remove-item').each(function () {
                                var $el = $(this);
                                $el.click(function (e) {
                                    var id = $el.attr("val");
                                    $scope.removeItem(id, ctrlID);
                                    e.stopPropagation();
                                });
                            });
                        }

                        if ($('.tree-dropdown-selected-item').length > 0) {
                            $('.tree-dropdown-selected-item').each(function () {
                                var $el = $(this);
                                $el.click(function (e) {
                                    e.stopPropagation();
                                });
                            });
                        }
                        $scope.hidePicker(ctrlID);
                    }

                    //#region ----------------- TREE MANIPULATE -----------------
                    $scope.showPicker = function (ctrlID) {
                        if ($("#DropdownItemWrapper_" + ctrlID).is(":visible")) {
                            return;
                        }
                        $("#DropdownItems_" + ctrlID).css({ height: "300px", width: ($("#DropdownContainer_" + ctrlID).width() + 2) + "px" });
                        $("#DropdownItemWrapper_" + ctrlID).css({ height: "300px" }).slideDown("fast");
                        $("body").bind("mousedown", function (event) {
                            if (!(event.target.id == "picker_" + ctrlID ||
                                event.target.id == "DropdownContainer_" + ctrlID ||
                                event.target.id == "DropdownView_" + ctrlID ||
                                event.target.id == "DropdownItemWrapper_" + ctrlID ||
                            $(event.target).parents("#DropdownItemWrapper_" + ctrlID).length > 0)) {
                                $scope.hidePicker(ctrlID);
                            }
                        });
                    }

                    $scope.hidePicker = function (ctrlID) {
                        $("#DropdownItemWrapper_" + ctrlID).fadeOut("fast");
                        $("body").unbind("mousedown", function (event) {
                            if (!(event.target.id == "picker_" + ctrlID ||
                                event.target.id == "DropdownContainer_" + ctrlID ||
                                event.target.id == "DropdownView_" + ctrlID ||
                                event.target.id == "DropdownItemWrapper_" + ctrlID ||
                                $(event.target).parents("#DropdownItemWrapper_" + ctrlID).length > 0)) {
                                $scope.hidePicker(ctrlID);
                            }
                        });
                    }

                    $scope.removeItem = function (id, ctrlID) {
                        var zTree = $.fn.zTree.getZTreeObj("DropdownItems_" + ctrlID);
                        var selectedNode = _.find(zTree.getCheckedNodes(true), function (item) {
                            return item.id == id;
                        });
                        if (selectedNode) {
                            zTree.checkNode(selectedNode, !selectedNode.checked, null, true);
                            $scope.hidePicker(ctrlID);
                        }
                    }
                    //#endregion -------------- END TREE MANIPULATE--------------

                },
                ],
            };
        },
    ]);

    function initControl($scope, element, attr, modelCtrl) {
        var multiSelect = $scope.multiSelect;
        var ctrlID = $scope.getUNID();
        var isIDMode = _.get($scope, "mode") === "id";

        // CHUẨN BỊ DATA SOURCE
        var tmp = _.cloneDeep($scope.dataSource);
        var dataSource = [];
        _.forEach(tmp, function (item) {
            dataSource.push(_.mapKeys(item, function (value, key) {
                if (key === "Code") {
                    return "id";
                } else if (key === "ParentCode") {
                    return "pId";
                } else if (key === "Title") {
                    return "name";
                } else {
                    return key;
                }
            }));
        });

        var setting =
        {
            check: multiSelect ? { enable: true, chkboxType: { "Y": "", "N": "" } } : { enable: true, chkStyle: "radio", radioType: "all" },
            view: { dblClickExpand: false },
            data: { simpleData: { enable: true } },
            callback:
            {
                onClick: function (e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    zTree.checkNode(treeNode, !treeNode.checked, null, true);
                    return false;
                },
                onCheck: function (e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    var nodes = zTree.getCheckedNodes(true);
                    $scope.setSelectedItems(ctrlID, nodes, dataSource, true);
                    $("#DropdownItemWrapper_" + ctrlID).css({ height: "500px" });
                },
            }
        };

        var selectedOptions = [];
        if (isIDMode) {
            if (modelCtrl.$modelValue) {
                //var selectedItem = _.find(dataSource, "id", modelCtrl.$modelValue);
                var selectedItem = _.find(dataSource, function (item) {
                    return item.id == modelCtrl.$modelValue;
                });
                selectedOptions.push(selectedItem);
            }
        } else {
            var tmpValues = _.cloneDeep(modelCtrl.$modelValue);
            _.forEach(tmpValues, function (item) {
                selectedOptions.push(_.mapKeys(item, function (value, key) {
                    if (key === "Code") {
                        return "id";
                    } else if (key === "ParentCode") {
                        return "pId";
                    } else if (key === "Title") {
                        return "name";
                    } else {
                        return key;
                    }
                }));
            });
        }
        if (_.get(selectedOptions, "length") > 0 && _.get(dataSource, "length") > 0) {
            _.forEach(selectedOptions, function (value) {
                var selectedItem = _.find(dataSource, function (item) {
                    return item.id === _.get(value, "id");
                });
                _.set(selectedItem, "checked", true);

                var selectedPid = _.get(selectedItem, "pId");
                while (selectedPid) {
                    var pItem = _.find(dataSource, function (item) {
                        return item.id == selectedPid;
                    });
                    _.set(pItem, "open", true);

                    selectedPid = _.get(pItem, "pId");
                }
            });
        } else {
            _.forEach(dataSource, function (item) {
                if (!item.pId) {
                    _.set(item, "open", true);
                } else {
                    if (!(_.get(_.filter(dataSource, function (node) {
                        return _.get(item, "pId") === _.get(node, "id")
                    }), "length") > 0)) {
                        _.set(item, "open", true);
                    }
                }
            });
        }

        // No check
        if (_.get($scope, "noCheckNotes.length") > 0) {
            _.forEach(_.get($scope, "noCheckNotes"), function (node) {
                _.set(_.find(dataSource, function (item) {
                    return _.get(item, "id") === node;
                }), "nocheck", true);
            });
        }

        // EXPAND FIRST NODE
        $.fn.zTree.init($("#DropdownItems_" + ctrlID), setting, dataSource);        
        $scope.setSelectedItems(ctrlID, selectedOptions, dataSource, false);
    }

})(this, angular, jQuery, guid, _);

