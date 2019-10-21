<%@ Page Language="C#" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<!DOCTYPE html>
<html ng-app="vbdc-app">

<head>
<meta name="WebPartPageExpansion" content="full" />
<meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description"
    content="Responsive sidebar template with sliding effect and dropdown menu based on bootstrap 3" />
  <title>Quản lý văn bản</title>
  <!-- build:sharepoint-css -->
  <SharePoint:CssLink runat="server" Version="15" __designer:Preview="" __designer:Values="&lt;P N=&#39;UIVersion&#39; T=&#39;&amp;gt;=15&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl00&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
  <SharePoint:CssRegistration Name="Themable/corev15.css" runat="server" __designer:Preview="" __designer:Values="&lt;P N=&#39;Name&#39; T=&#39;Themable/corev15.css&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl01&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
  <!-- endbuild -->

  <link rel="stylesheet" href="App/framework/bootstrap.min.css" />
  <script src="App/framework/jquery.min.js"></script>
  <script src="App/framework/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
    integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous" />
  <script src="App/framework/angular.js"></script>
  <script src="App/framework/angular-ui-router.min.js"></script>
  <script src="App/framework/lodash.js"></script>
  <link rel="stylesheet" href="App/framework/kendo-UI/css/kendo.custom.min.css" />
  <link rel="stylesheet" href="App/plugins/ztree/css/zTreeStyle/zTreeStyle.css" />
  <script type="text/javascript" src="App/framework/kendo-UI/js/kendo.custom.min.js"></script>
  <script type="text/javascript" src="App/framework/moment.js"></script>
  <script type="text/javascript" src="App/framework/camljs.js"></script>
  <script type="text/javascript" src="App/framework/angular-sanitize.js"></script>
  <script type="text/javascript" src="App/framework/ng-csv.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.js"></script>
  
  <link rel="stylesheet" href="App/app/css/main.css" />
  <link rel="stylesheet" href="App/app/css/custom.css" />
  <link rel="stylesheet" href="App/app/css/components.css" />
  <!--<link rel="shortcut icon" type="image/png" href="App/img/favicon.png" />-->
</head>

<body>
  <SharePoint:SharePointForm runat="server" __designer:Preview="&lt;table cellpadding=4 cellspacing=0 style=&quot;font:messagebox;color:buttontext;background-color:buttonface;border: solid 1px;border-top-color:buttonhighlight;border-left-color:buttonhighlight;border-bottom-color:buttonshadow;border-right-color:buttonshadow&quot;&gt;
              &lt;tr&gt;&lt;td nowrap&gt;&lt;span style=&quot;font-weight:bold&quot;&gt;SharePointForm&lt;/span&gt; - Unnamed3&lt;/td&gt;&lt;/tr&gt;
              &lt;tr&gt;&lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
            &lt;/table&gt;" __designer:Values="&lt;P N=&#39;Method&#39; T=&#39;post&#39; /&gt;&lt;P N=&#39;Name&#39; ID=&#39;1&#39; T=&#39;ctl02&#39; /&gt;&lt;P N=&#39;TagName&#39; T=&#39;form&#39; /&gt;&lt;P N=&#39;ID&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;">
    <SharePoint:FormDigest runat="server" />
  </SharePoint:SharePointForm>
  <div class="page-wrapper ice-theme toggled">
    <div ui-view="sidebar"></div>
    <!-- page-content  -->
    <main class="page-content pt-2">
      <vbdc-header></vbdc-header>
      <hr />
      <div class="form-group col-md-12">
        <div ui-view="content"></div>
      </div>
      <div id="overlay" class="overlay"></div>
    </main>
    <!-- page-content" -->
  </div>
  <!-- page-wrapper -->
  <!-- build:sharepoint-js -->

  <SharePoint:ScriptLink name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false"/>
  <SharePoint:ScriptLink name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false"/>
  <SharePoint:ScriptLink name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false"/>
  <SharePoint:ScriptLink name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false"/>
  <SharePoint:ScriptLink name="sp.js" runat="server" LoadAfterUI="true" Localizable="false"/>
  <SharePoint:ScriptLink name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false"/>
  <SharePoint:ScriptLink name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false"/>

  <!-- endbuild -->
  <!-- using online scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js"
    integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut"
    crossorigin="anonymous"></script>
  <script src="//malihu.github.io/custom-scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>

  <script type="text/javascript" src="App/app/js/vbdc.js"></script>
  <script type="text/javascript" src="/_layouts/15/sp.js"></script>
  <script type="text/javascript" src="/_layouts/15/SP.RequestExecutor.js"></script>
  <script type="text/javascript" src="App/plugins/ztree/js/jquery.ztree.all.js"></script>
</body>

</html>