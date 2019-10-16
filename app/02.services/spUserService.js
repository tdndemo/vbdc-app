"use strict";
(function (global, app, _, $) {
    app.service("spUserService", [
         "$q", "$http",
        function ($q, $http) {

            //#region ------------------------------ USER FUNCTIONS ------------------------------

            //#region ------------------------------ GET SP USER BY ID ------------------------------
            /*
                TRẢ VỀ:
                    - LoginName
                    - Title: Tên người dùng
                    - Email
            */
            this.getProfileDetail = function (userName) {
                var dfd = $q.defer();
                var theData = {
                    "propertiesForUser": {
                        "__metadata": { "type": "SP.UserProfiles.UserProfilePropertiesForUser" },
                        "accountName": "" + userName + "",
                        "propertyNames": ["PreferredName", "Department"]
                    }
                };

                var requestHeaders = {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                };

                jQuery.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                    type: "POST",
                    // data: JSON.stringify(theData),
                    contentType: "application/json;odata=verbose",
                    headers: requestHeaders,
                    success: function (data) {
                        dfd.resolve(_.get(data, "d"));
                    },
                    error: function (jqxr, errorCode, errorThrown) {
                        dfd.reject(null);
                    }
                });

                return dfd.promise;
            };
            this.getUser = function (id) {
                var dfd = $q.defer();
                if (id > 0) {
                    $http.defaults.headers.post['X-HTTP-Method'] = ""
                    var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/GetUserById(" + id + ")";
                    $http
                        .get(restUrl,
                            {
                                headers: {
                                    "Accept": "application/json;odata=verbose",
                                },
                            })
                        .success(function (data) {
                            dfd.resolve(_.get(data, "d"));
                        }).error(function (error) {
                            console.log(error);
                            dfd.resolve(null);
                        });
                } else {
                    dfd.resolve(null);
                }
                return dfd.promise;
            };
            //#endregion --------------------------- END GET SP USER BY ID --------------------------


            //#region ------------------------------ GET LIST SP USERS BY LIST ID ------------------------------
            this.getUsers = function (ids, params, headers) {
                var self = this;
                var promises = _.map(ids, function (id) {
                    return self.getUser(id);
                });

                return $q.all(promises);
            }
            //#endregion --------------------------- END GET LIST SP USERS BY LIST ID --------------------------

            this.getCleanLoginName = function (loginName) {
                var _return = loginName;
                if (loginName && loginName.indexOf("\\") > 0) {
                    _return = loginName.substr(loginName.indexOf("\\") + 1, loginName.length)
                }
                return _return;
            }

            //#region ------------------------------ GET SP USER BY LOGIN NAME ------------------------------
            this.ensureUser = function (logonName) {
                var dfd = $q.defer();
                logonName = this.getCleanLoginName(logonName);
                if (logonName) {
                    $http.defaults.headers.post['X-HTTP-Method'] = ""
                    $http.defaults.headers.common.Accept = "application/json;odata=verbose";
                    $http.defaults.headers.post["Content-Type"] = "application/json;odata=verbose";
                    $http.defaults.headers.post["If-Match"] = "*";
                    $http.defaults.headers.post["X-RequestDigest"] = $("#__REQUESTDIGEST").val();
                    var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureUser('" + encodeURIComponent(logonName) + "')";
                    $http
                        .post(restUrl)
                        .success(function (data) {
                            dfd.resolve(_.get(data, "d"));
                        })
                        .error(function (error) {
                            console.log(error);
                            dfd.resolve(null);
                        });
                } else {
                    dfd.resolve(null);
                }
                $http.defaults.headers.common.Accept = "text/plain,application/json,*/*";
                return dfd.promise;
            };
            //#endregion --------------------------- END GET SP USER BY LOGIN NAME --------------------------


            //#region ------------------------------ GET LIST SP USERS BY LIST LOGIN NAME ------------------------------
            this.ensureUsers = function (logonNames) {
                var self = this;
                var promises = _.map(logonNames, function (name) {
                    return self.ensureUser(name);
                });

                return $q.all(promises);
            };
            //#endregion --------------------------- END GET LIST SP USERS BY LIST LOGIN NAME --------------------------

            //#endregion --------------------------- END USER FUNCTIONS --------------------------

            //#region ------------------------------ USERS & GROUPS FUNCTIONS ------------------------------


            this.getGroup = function (id) {
                var dfd = $q.defer();
                var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/SiteGroups/GetById(" + id + ")";
                $http.get(restUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(false);
                });
                return dfd.promise;
            };

            //#region ------------------------------ GET USERS IN GROUP ------------------------------
            this.getUsersInGroup = function (groupName) {
                var dfd = $q.defer();
                $http.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('" + groupName + "')/Users", {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d.results"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(null);
                });
                return dfd.promise;
            }
            //#endregion --------------------------- END GET USERS IN GROUP --------------------------

            //#region ------------------------------ GET USERS IN GROUP ------------------------------
            this.getSPGroupsOfUser = function (userId) {
                var dfd = $q.defer();
                var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetUserById(" + userId + ")/Groups";
                $http.get(restUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d.results"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(null);
                });
                return dfd.promise;
            }
            //#endregion --------------------------- END GET USERS IN GROUP --------------------------

            //#endregion --------------------------- END USERS & GROUPS FUNCTIONS --------------------------

            //#region ------------------------------ USERS PROFILE SERVICES FUNCTIONS ------------------------------
            //#region ------------------------------ GET PROFILE BY USER ID ------------------------------
            /*
                PROFILE PROPERTY:
                    - ID
                    - LoginName
                    - Name
                    - Email
                    - Groups
                        + ID
                        + Title
             */

            this.getProfileByID = function (userId) {
                var dfd = $q.defer();
                var thisService = this;
                var profile = { ID: userId };
                thisService
                    .getUser(userId)
                    .then(function (spProfile) {
                        if (spProfile) {
                            profile.LoginName = spProfile.LoginName;
                            profile.Name = spProfile.Title;
                            profile.Email = spProfile.Email;
                            thisService
                                  .getSPGroupsOfUser(userId)
                                  .then(function (spGroups) {
                                      profile.Groups = spGroups;
                                      dfd.resolve(profile);
                                  })
                                  .catch(function (error) {
                                      dfd.resolve(profile);
                                  });
                        } else {
                            dfd.resolve(profile);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        dfd.resolve(profile);
                    });
                return dfd.promise;
            };

            //#endregion --------------------------- END GET PROFILE BY USER ID --------------------------

            //#region ------------------------------ GET CURRENT PROFILE ------------------------------
            this.curProfile = null;
            this.getCurrentProfile = function () {
                var dfd = $q.defer();
                var thisService = this;
                if (!thisService.curProfile) {
                    thisService
                        .getProfileByID(_spPageContextInfo.userId)
                        .then(function (profile) {
                            thisService.curProfile = profile;
                            dfd.resolve(thisService.curProfile);
                        })
                        .catch(function (error) {
                            console.log(error);
                            thisService.curProfile = profile;
                            dfd.resolve(thisService.curProfile);
                        });
                } else {
                    dfd.resolve(thisService.curProfile);
                }
                return dfd.promise;
            };

            this.getAllAttachment = function (appweburl, listName, itemId) {
                var dfd = $q.defer();
                var clientContext = new SP.RequestExecutor(appweburl);
                clientContext.executeAsync({
                    url: appweburl +
                        "/_api/lists/GetByTitle('" + listName + "')/items(" + itemId + ")?$select=AttachmentFiles&$expand=AttachmentFiles",
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        var jsonObject = JSON.parse(data.body);
                        dfd.resolve(jsonObject.d);
                    },
                    error: function (data, errorCode, errorMessage) {
                        dfd.reject("errorMessage");
                    }
                });
                return dfd.promise;
            }
            this.deleteAttachment = function (appweburl, listName, itemId, fileName) {
                var dfd = $q.defer();
                var ctx = new SP.ClientContext(appweburl);
                var list = ctx.get_web().get_lists().getByTitle(listName);
                var item = list.getItemById(itemId);
                //for (var i = 0; i < fileName.length; i++) {
                var attachmentFile = item.get_attachmentFiles().getByFileName(fileName);
                attachmentFile.deleteObject();
                //}
                ctx.executeQueryAsync(
                  function () {
                      //console.log('Attachment file has been deleted');
                      dfd.resolve(true);
                  },
                  function (sender, args) {
                      console.log(args.get_message());
                      dfd.reject(false);
                  });
                return dfd.promise;
            }
            this.getFileBuffer = function (file) {
                var dfd = $q.defer();
                var reader = new FileReader();
                reader.onload = function (e) {
                    dfd.resolve(e.target.result);
                }
                reader.onerror = function (e) {
                    dfd.reject(e.target.error);
                }
                reader.readAsArrayBuffer(file);
                return dfd.promise;
            }
            this.uploadFileSP = function (appweburl, listName, id, fileName, file) {
                //var dfd = $q.defer();
                this.getFileBuffer(file).then(
                    function (buffer) {
                        var bytes = new Uint8Array(buffer);
                        ///var content = new SP.Base64EncodedByteArray();
                        var binary = '';
                        for (var b = 0; b < bytes.length; b++) {
                            binary += String.fromCharCode(bytes[b]);
                        }
                        $().SPServices({
                            operation: "AddAttachment",
                            webURL: appweburl,
                            listName: listName,
                            listItemID: id,
                            fileName: fileName,
                            attachment: btoa(binary)
                        });
                    });
            }
            this.getPropertiesFor = function (accountName) {
                var dfd = $q.defer();
                var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + encodeURIComponent(accountName) + "'";
                var requestHeader = {
                    headers: { "Accept": "application/json;odata=verbose", "X-RequestDigest": jQuery("#__REQUESTDIGEST").val() }
                };
                $http
                    .get(restUrl, requestHeader)
                    .success(function (data) {
                        var properties = _.get(data, "d.UserProfileProperties.results");
                        var $return = _.get(data, "d");
                        if (_.get(properties, "length") > 0) {
                            for (var i = 0; i < _.get(properties, "length") ; i++) {
                                var property = properties[i];
                                if (property.Key == "PictureURL") {
                                    _.set($return, "PictureURL", property.Value);
                                }
                            }
                        }
                        dfd.resolve($return);
                    })
                    .error(function (error) {
                        console.log(error);
                        dfd.resolve(null);
                    });
                return dfd.promise;
            }

            this.changeLogo = function (siteUrl, logoUrl) {
                var dfd = $q.defer();
                var clientContext = new SP.ClientContext(siteUrl);
                var web = clientContext.get_web();
                web.set_siteLogoUrl(logoUrl);
                web.update();
                clientContext.executeQueryAsync(
                    function () {
                        dfd.resolve([]);
                    },
                    function (sender, args) {
                        dfd.reject(args.get_message());
                    }
                );

                return dfd.promise;
            }

            //#endregion --------------------------- END GET CURRENT PROFILE --------------------------

            //#endregion --------------------------- END USERS PROFILE SERVICES FUNCTIONS --------------------------

            //#region ----- ADD, REMOVE USER FROM GROUP --- 

            this.getGroupIdByName = function (groupName) {
                var dfd = $q.defer();
                var executor;
                var appweburl = _spPageContextInfo.siteAbsoluteUrl;
                // Initialize the RequestExecutor with the app web URL.  
                executor = new SP.RequestExecutor(appweburl);

                executor.executeAsync({
                    url: appweburl + "/_api/web/sitegroups/getbyname('" + groupName + "')?$select=id",
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "content-type": "application/json; odata=verbose"
                    },

                    success: function (data) {
                        var obj = JSON.parse(data.body);
                        dfd.resolve(obj.d.Id);
                    },
                    error: function (err) {
                        console.log(JSON.stringify(err));
                    }
                });
                return dfd.promise;
            }

            this.addUserToGroup = function (userId, groupId) {
                var dfd = $q.defer();
                this.getUser(userId)
                    .then(function (user) {
                        var executor;
                        var userEmail = _.last(user.LoginName.split('|'));
                        var appweburl = _spPageContextInfo.siteAbsoluteUrl;
                        // Initialize the RequestExecutor with the app web URL.  
                        executor = new SP.RequestExecutor(appweburl);

                        executor.executeAsync({

                            url: appweburl + "/_api/web/sitegroups(" + groupId + ")/users",
                            method: "POST",
                            body: "{ '__metadata': { 'type': 'SP.User' }, 'LoginName': 'i:0#.f|membership|" + userEmail + "' }",
                            headers: {
                                "Accept": "application/json; odata=verbose",
                                "content-type": "application/json; odata=verbose"
                            },

                            success: function (data) {

                            },
                            error: function (err) {
                                console.log(JSON.stringify(err));
                            }
                        });
                    });
                return dfd.promise;
            };

            this.removeUserFromGroup = function (userId, groupId) {
                var dfd = $q.defer();
                var executor;                
                var appweburl = _spPageContextInfo.siteAbsoluteUrl;
                // Initialize the RequestExecutor with the app web URL.  
                executor = new SP.RequestExecutor(appweburl);

                executor.executeAsync({
                    url: appweburl + "/_api/web/sitegroups(" + groupId + ")/users/removebyid(" + userId + ")",
                    method: "POST",                    
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "content-type": "application/json; odata=verbose"
                    },

                    success: function (data) {
                        // remove successful
                    },
                    error: function (err) {
                        console.log(JSON.stringify(err));
                    }
                });
                return dfd.promise;
            };
            //#endregion ----- ADD, REMOVE USER FROM GROUP --- 
            this.getSubWeb = function (url) {
                var dfd = $q.defer();
                var restUrl = url + "/_api/web/webs?$select=Title,Url,Folders";
                $http.get(restUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d.results"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(false);
                });
                return dfd.promise;
            };

            this.getPages = function (url, listname) {
                var dfd = $q.defer();
                var restUrl = url + "/_api/lists/getByTitle('" + listname + "')/items?$select=Title,UniqueId,File/Name,File/ServerRelativeUrl&$expand=File";
                $http.get(restUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                    },
                }).success(function (data) {
                    dfd.resolve(_.get(data, "d.results"));
                }).error(function (error) {
                    console.log(error);
                    dfd.resolve(false);
                });
                return dfd.promise;
            };
        }
    ]);

})(this, angular.module("vbdc-app"), _, jQuery);
