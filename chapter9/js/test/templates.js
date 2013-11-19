(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['handlebars.js'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n      <li>\n          <div class='icon'>\n              <img src='"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.profile_image_url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'></img>\n        </div>\n            <div class='data'>\n                <h4>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\n                \n                <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.format),stack1 ? stack1.call(depth0, depth0.text, options) : helperMissing.call(depth0, "format", depth0.text, options)))
    + "</p>\n                <p class=\"timestamp\"><i>";
  if (stack2 = helpers.friendlyDate) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.friendlyDate; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</i></p>\n            </div>\n        </li>\n        ";
  return buffer;
  }

  buffer += "\n\n\n<script type=\"text/x-handlebars-template\" id=\"profile-template\">\n <div class='tiles clearfix'>\n    <div class=\"tile double bg-color-orangeDark\">\n      <div class=\"tile-content\">\n          <img src=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.profile_image_url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"place-left\">\n          <h3 style=\"margin-bottom: 5px;\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\n          <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n          <div class=\"brand\">\n              <div class=\"badge\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.followers_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Followers</div>\n          </div>\n      </div>\n    </div>\n  </div>\n</script>\n\n\n<script type=\"text/x-handlebars-template\" id=\"timeline-template\">\n <ul class='listview fluid'>\n        ";
  stack2 = helpers.each.call(depth0, depth0.tweet, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </ul>\n </script>";
  return buffer;
  });
})();