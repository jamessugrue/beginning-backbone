(function(context) {
  // ensure backbone and jquery are available
  if(typeof Backbone === 'undefined') alert('backbone environment not loaded') ;
  if(typeof $ === 'undefined') alert('jquery environment not loaded');


  // define our Backbone.UI namespace
  Backbone.UI = Backbone.UI || {
    KEYS : {
      KEY_BACKSPACE: 8,
      KEY_TAB:       9,
      KEY_RETURN:   13,
      KEY_ESC:      27,
      KEY_LEFT:     37,
      KEY_UP:       38,
      KEY_RIGHT:    39,
      KEY_DOWN:     40,
      KEY_DELETE:   46,
      KEY_HOME:     36,
      KEY_END:      35,
      KEY_PAGEUP:   33,
      KEY_PAGEDOWN: 34,
      KEY_INSERT:   45
    },

    setSkin : function(skin) {
      if(!!Backbone.UI.currentSkin) {
        $(document.body).removeClass('skin_' + Backbone.UI.currentSkin);
      }
      $(document.body).addClass('skin_' + skin);
      Backbone.UI.currentSkin = skin;
    },

    noop : function(){},

    IS_MOBILE : 
      document.ontouchstart !== undefined || 
      document.ontouchstart === null
  };

  _(Backbone.View.prototype).extend({
    // resolves the appropriate content from the given choices
    resolveContent : function(model, content) {
      model = _(model).exists() ? model : this.model;
      content = _(content).exists() ? content : this.options.content;
      var hasModelProperty = _(model).exists() && _(content).exists();
      return _(content).isFunction() ? content(model) : 
        hasModelProperty && _(model[content]).isFunction() ? model[content]() : 
        hasModelProperty && _(_(model).resolveProperty(content)).isFunction() ? _(model).resolveProperty(content)(model) : 
        hasModelProperty ? _(model).resolveProperty(content) : content;
    },

    mixin : function(objects) {
      var options = _(this.options).clone();

      _(objects).each(function(object) {
        $.extend(true, this, object);
      }, this);

      $.extend(true, this.options, options);
    }
  });

  // Add some utility methods to underscore
  _.mixin({
    // produces a natural language description of the given
    // index in the given list
    nameForIndex : function(list, index) {
      return list.length === 1 ? 'first last' : 
        index === 0 ? 'first' : 
        index === list.length - 1 ? 
        'last' : 'middle';
    },

    exists : function(object) {
      return !_(object).isNull() && !_(object).isUndefined();
    },
    
    // resolves the value of the given property on the given 
    // object.
    resolveProperty : function(object, property) {
      var result = null;
      if(_(property).exists() && _(property).isString()) {
        var parts = property.split('.');
        _(parts).each(function(part) {
          if(_(object).exists()) {
            var target = result || object;
            result = _(target.get).isFunction() ? target.get(part) : target[part];
          }
        });
      }

      return result;
    },

    // sets the given value for the given property on the given 
    // object.
    setProperty : function(object, property, value, silent) {
      if(!property) return;

      var parts = property.split('.');
      _(parts.slice(0, parts.length - 2)).each(function(part) {
        if(!_(object).isNull() && !_(object).isUndefined()){ 
          object = _(object.get).isFunction() ? object.get(part) : object[part];
        }
      });

      if(!!object) {
        if(_(object.set).isFunction()) {
          var attributes = {};
          attributes[property] = value;
          object.set(attributes, {silent : silent});
        }
        else {
          object[property] = value;
        }
      }
    }
  });

  var _alignCoords = function(el, anchor, pos, xFudge, yFudge) {
    el = $(el);
    anchor = $(anchor);
    pos = pos || '';

    // Get anchor bounds (document relative)
    var bOffset = anchor.offset();
    var bDim = {width : anchor.width(), height : anchor.height()};

    // Get element dimensions
    var elbOffset = el.offset();
    var elbDim = {width : el.width(), height : el.height()};

    // Determine align coords (document-relative)
    var x,y;
    if (pos.indexOf('-left') >= 0) {
      x = bOffset.left;
    } else if (pos.indexOf('left') >= 0) {
      x = bOffset.left - elbDim.width;
    } else if (pos.indexOf('-right') >= 0) {
      x = (bOffset.left + bDim.width) - elbDim.width;
    } else if (pos.indexOf('right') >= 0) {
      x = bOffset.left + bDim.width;
    } else { // Default = centered
      x = bOffset.left + (bDim.width - elbDim.width)/2;
    }

    if (pos.indexOf('-top') >= 0) {
      y = bOffset.top;
    } else if (pos.indexOf('top') >= 0) {
      y = bOffset.top - elbDim.height;
    } else if (pos.indexOf('-bottom') >= 0) {
      y = (bOffset.top + bDim.height) - elbDim.height;
    } else if (pos.indexOf('bottom') >= 0) {
      y = bOffset.top + bDim.height;
    } else { // Default = centered
      y = bOffset.top + (bDim.height - elbDim.height)/2;
    }
    
    // Check for constrainment (default true)
    var constraint = true;
    if (pos.indexOf('no-constraint') >= 0) constraint = false;

    // Add fudge factors
    x += xFudge || 0;
    y += yFudge || 0;

    // Create bounds rect/constrain to viewport
    //var nb = new zen.util.Rect(x,y,elb.width,elb.height);
    //if (constraint) nb = nb.constrainTo(zen.util.Dom.getViewport());

    // Convert to offsetParent coordinates
    //if(el.offsetParent()) {
      //var ob = $(el.offsetParent).getOffset();
      //nb.translate(-ob.left, -ob.top);
    //}

    // Return rect, constrained to viewport
    return {x : x, y : y};
  };


  // Add some utility methods to JQuery
  _($.fn).extend({
    // aligns each element releative to the given anchor
    alignTo : function(anchor, pos, xFudge, yFudge, container) {
      _.each(this, function(el) {
        var rehide = false;
        // in order for alignTo to work properly the element needs to be visible
        // if it's hidden show it off screen so it can be positioned
        if(el.style.display === 'none') {
          rehide=true;
          $(el).css({position:'absolute',top:'-10000px', left:'-10000px', display:'block'});
        }

        var o = _alignCoords(el, anchor, pos, xFudge, yFudge);
        $(el).css({
          position:'absolute',
          left: Math.round(o.x) + 'px',
          top: Math.round(o.y) + 'px'
        });

        if(rehide) $(el).hide();
      });
    },

    // Hides each element the next time the user clicks the mouse or presses a
    // key.  This is a one-shot action - once the element is hidden, all
    // related event handlers are removed.
    autohide : function(options) {
      _.each(this, function(el) {
        options = _.extend({
          leaveOpen : false,
          hideCallback : false,
          ignoreInputs: false,
          ignoreKeys : [],
          leaveOpenTargets : []
        }, options || {});
        
        el._autoignore = true;
        setTimeout(function() {
          el._autoignore = false; $(el).removeAttr('_autoignore'); 
        }, 0);

        if (!el._autohider) {
          el._autohider = _.bind(function(e) {

            var target = e.target;
            if(!$(el).is(':visible')) return;

            if (options.ignoreInputs && (/input|textarea|select|option/i).test(target.nodeName)) return;
            //if (el._autoignore || (options.leaveOpen && Element.partOf(e.target, el)))
            if(el._autoignore) return;
            // pass in a list of keys to ignore as autohide triggers
            if(e.type && e.type.match(/keypress/) && _.include(options.ignoreKeys, e.keyCode)) return;
            
            // allows you to provide an array of elements that should not trigger autohiding.
            // This is useful for doing thigns like a flyout menu from a pulldown
            if(options.leaveOpenTargets) {
              var ancestor = _(options.leaveOpenTargets).find(function(t) {
                return e.target === t || $(e.target).closest($(t)).length > 0;
              });
              if(!!ancestor) return;
            }
            
            var proceed = (options.hideCallback) ? options.hideCallback(el) : true;
            if (!proceed) return;

            $(el).hide();
            $(document).bind('click', el._autohider);
            $(document).bind('keypress', el._autohider);
            el._autohider = null;
          }, this);

          $(document).bind('click', el._autohider);
          $(document).bind('keypress', el._autohider);
        }
      });
    }
  });
}(this));
(function(){
  window.Backbone.UI.Button = Backbone.View.extend({
    options : {
      tagName : 'a',

      // true will disable the button
      // (muted non-clickable) 
      disabled : false,

      // true will activate the button
      // (depressed and non-clickable)
      active : false,

      hasBorder : true,

      // A callback to invoke when the button is clicked
      onClick : null,

      // renders this button as an input type=submit element as opposed to an anchor.
      isSubmit : false
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);

      _(this).bindAll('render');

      $(this.el).addClass('button');

      // if we're running in a mobile environment, the 'click' event 
      // isn't quite translated correctly
      if(Backbone.UI.IS_MOBILE) {
        $(this.el).bind('touchstart', _(function(e) {
          $(this.el).addClass('active');

            Backbone.UI._activeButton = this;
            var bodyUpListener = $(document.body).bind('touchend', function(e) {
              if(Backbone.UI._activeButton) {
                if(e.target === Backbone.UI._activeButton.el || $(e.target).closest('.button.active').length > 0) {
                  if(Backbone.UI._activeButton.options.onClick) Backbone.UI._activeButton.options.onClick(e); 
                }
                $(Backbone.UI._activeButton.el).removeClass('active');
              }

              Backbone.UI._activeButton = null;
              $(document.body).unbind('touchend', bodyUpListener);
            });

          return false;
        }).bind(this));
      }

      else {
        $(this.el).bind('click', _(function(e) {
          if(!this.options.disabled && !this.options.active && this.options.onClick) {
            this.options.onClick(e); 
          }
          return false;
        }).bind(this));
      }
    },

    render : function() {
      var labelText = this.resolveContent();

      this._observeModel(this.render);

      $(this.el).empty();
      $(this.el).toggleClass('has_border', this.options.hasBorder);

      if(this.options.isSubmit) {
        $.el.input({
          type : 'submit',
          value : ''
        }).appendTo(this.el);
      }

      this.el.appendChild($.el.span({className : 'label'}, labelText));

      // add appropriate class names
      this.setEnabled(!this.options.disabled);
      this.setActive(this.options.active);

      return this;
    },

    // sets the enabled state of the button
    setEnabled : function(enabled) {
      if(enabled) {
        this.el.href = '#';
      } else { 
        this.el.removeAttribute('href');
      }
      this.options.disabled = !enabled;
      $(this.el)[enabled ? 'removeClass' : 'addClass']('disabled');
    },

    // sets the active state of the button
    setActive : function(active) {
      this.options.active = active;
      $(this.el)[active ? 'addClass' : 'removeClass']('active');
    }
  });
}());

(function() {

  var monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var dayNames   = ['s', 'm', 't', 'w', 't', 'f', 's'];

  var isLeapYear = function(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  };

  var daysInMonth = function(date) {
    return [31, (isLeapYear(date.getYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
  };

  var formatDateHeading = function(date) {
    return monthNames[date.getMonth()] + ' ' + date.getFullYear();
  };

  var isSameMonth = function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && 
      date1.getMonth() === date2.getMonth();
  };

  window.Backbone.UI.Calendar = Backbone.View.extend({
    options : {
      // the selected calendar date
      date : null, 

      // the week's start day (0 = Sunday, 1 = Monday, etc.)
      weekStart : 0,

      // a callback to invoke when a new date selection is made.  The selected date
      // will be passed in as the first argument
      onSelect : null
    },

    date : null, 

    initialize : function() {
      $(this.el).addClass('calendar');
      _(this).bindAll('render');
    },

    render : function() {
      if(_(this.model).exists() && _(this.options.content).exists()) {
        this.date = this.resolveContent();
        var key = 'change:' + this.options.content;
        this.model.unbind(key, this.render);
        this.model.bind(key, this.render);
      }

      else {
        this.date = this.date || this.options.date || new Date();
      }

      this._renderDate(this.date);

      return this;
    },

    _selectDate : function(date) {
      this.date = date;
      if(_(this.model).exists() && _(this.options.content).exists()) {

        // we only want to set the bound property's date portion
        var boundDate = this.resolveContent();
        var updatedDate = new Date(boundDate.getTime());
        updatedDate.setMonth(date.getMonth());
        updatedDate.setDate(date.getDate());
        updatedDate.setFullYear(date.getFullYear());

        _(this.model).setProperty(this.options.content, updatedDate);
      }
      this.render();
      if(_(this.options.onSelect).isFunction()) {
        this.options.onSelect(date);
      }
      return false;
    },

    _renderDate : function(date, e) {
      if(e) e.stopPropagation();
      $(this.el).empty();

      var nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
      var lastMonth = new Date(date.getFullYear(), date.getMonth() - 1);
      var monthStartDay = (new Date(date.getFullYear(), date.getMonth(), 1).getDay());
      var inactiveBeforeDays = monthStartDay - this.options.weekStart - 1;
      var daysInThisMonth = daysInMonth(date);
      var today = new Date();
      var inCurrentMonth = isSameMonth(today, date);
      var inSelectedMonth = !!this.date && isSameMonth(this.date, date);

      var daysRow = $.el.tr({className : 'row days'}); 
      var names = dayNames.slice(this.options.weekStart).concat(
        dayNames.slice(0, this.options.weekStart));
      for(var i=0; i<names.length; i++) {
        $.el.td(names[i]).appendTo(daysRow);
      }

      var tbody, table = $.el.table(
        $.el.thead(
          $.el.th(
            $.el.a({className : 'go_back', onclick : _(this._renderDate).bind(this, lastMonth)}, '\u2039')),
          $.el.th({className : 'title', colspan : 5},
            $.el.div(formatDateHeading(date))),
          $.el.th(
            $.el.a({className : 'go_forward', onclick : _(this._renderDate).bind(this, nextMonth)}, '\u203a'))),
        tbody = $.el.tbody(daysRow));

      var day = inactiveBeforeDays >= 0 ? daysInMonth(lastMonth) - inactiveBeforeDays : 1;
      var daysRendered = 0;
      for(var rowIndex=0; rowIndex<6 ; rowIndex++) {

        var row = $.el.tr({
          className : 'row' + (rowIndex === 0 ? ' first' : rowIndex === 4 ? ' last' : '')
        });

        for(var colIndex=0; colIndex<7; colIndex++) {
          var inactive = daysRendered <= inactiveBeforeDays || 
            daysRendered > inactiveBeforeDays + daysInThisMonth;

          var callback = _(this._selectDate).bind(
            this, new Date(date.getFullYear(), date.getMonth(), day));

          var className = 'cell' + (inactive ? ' inactive' : '') + 
            (colIndex === 0 ? ' first' : colIndex === 6 ? ' last' : '') +
            (inCurrentMonth && !inactive && day === today.getDate() ? ' today' : '') +
            (inSelectedMonth && !inactive && day === this.date.getDate() ? ' selected' : '');

          $.el.td({ className : className }, 
            inactive ? 
              $.el.div({ className : 'day' }, day) : 
              $.el.a({ className : 'day', onClick : callback }, day)).appendTo(row);

          day = (rowIndex === 0 && colIndex === inactiveBeforeDays) || 
            (rowIndex > 0 && day === daysInThisMonth) ? 1 : day + 1;

          daysRendered++;
        }

        row.appendTo(tbody);
      }

      this.el.appendChild(table);

      return false;
    }
  });
}());
(function(){
  window.Backbone.UI.Checkbox = Backbone.View.extend({

    options : {
      tagName : 'a',

      // The property of the model describing the label that 
      // should be placed next to the checkbox
      labelContent : null,

      // enables / disables the checkbox
      disabled : false
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);
      _(this).bindAll('render');

      $(this.el).click(_(this._onClick).bind(this));
      $(this.el).attr({href : '#'});
      $(this.el).addClass('checkbox');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
    },

    render : function() {

      this._observeModel(this.render);

      $(this.el).empty();

      this.checked = this.checked || this.resolveContent();
      var mark = $.el.div({className : 'checkmark'});
      if(this.checked) {
        mark.appendChild($.el.div({className : 'checkmark_fill'}));
      }

      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      this._label = $.el.div({className : 'label'}, labelText);
      $('a',this._label).click(function(e){
        e.stopPropagation(); 
      });
      this.el.appendChild(mark);
      this.el.appendChild(this._label);
      this.el.appendChild($.el.br({style : 'clear:both'}));

      return this;
    },

    _onClick : function() {
      if (this.options.disabled) {
        return false;
      }

      this.checked = !this.checked;
      if(_(this.model).exists() && _(this.options.content).exists()) {
        _(this.model).setProperty(this.options.content, this.checked);
      }

      else {
        this.render();
      }

      return false;
    }
  });
}());
(function(){
  window.Backbone.UI.CollectionView = Backbone.View.extend({
    options : {
      // The Backbone.Collection instance the view is bound to
      model : null,

      // The Backbone.View class responsible for rendering a single item in the collection
      itemView : null,

      // A string, element, or function describing what should be displayed
      // when the list is empty.
      emptyContent : null,

      // A callback to invoke when a row is clicked.  The associated model will be
      // passed as the first argument.
      onItemClick : Backbone.UI.noop,

      // The maximum height in pixels that this table show grow to.  If the
      // content exceeds this height, it will become scrollable.
      maxHeight : null
    },

    itemViews : {},

    _emptyContent : null,

    // must be over-ridden to describe how an item is rendered
    _renderItem : Backbone.UI.noop,

    initialize : function() {
      if(this.model) {
        this.model.bind('add', _.bind(this._onItemAdded, this));
        this.model.bind('change', _.bind(this._onItemChanged, this));
        this.model.bind('remove', _.bind(this._onItemRemoved, this));
        this.model.bind('refresh', _.bind(this.render, this));
        this.model.bind('reset', _.bind(this.render, this));
      }
    },

    _onItemAdded : function(model, list, options) {
      // first check if we've already rendered an item for this model
      if(!!this.itemViews[model.cid]) {
        return;
      }

      // remove empty content if it exists
      if(!!this._emptyContent) {
        if(!!this._emptyContent.parentNode) this._emptyContent.parentNode.removeChild(this._emptyContent);
        this._emptyContent = null;
      }
       
      // render the new item
      var properIndex = list.indexOf(model);
      var el = this._renderItem(model, properIndex);

      // insert it into the DOM position that matches it's position in the model
      var anchorNode = this.collectionEl.childNodes[properIndex];
      this.collectionEl.insertBefore(el, _(anchorNode).isUndefined() ? null : anchorNode);

      // update the first / last class names
      this._updateClassNames();
    },

    _onItemChanged : function(model) {
      var view = this.itemViews[model.cid];
      // re-render the individual item view if it's a backbone view
      if(!!view && view.el && view.el.parentNode) {
        view.render();
        this._ensureProperPosition(view);
      }

      // otherwise, we re-render the entire collection
      else {
        this.render();
      }
    },

    _onItemRemoved : function(model) {
      var view = this.itemViews[model.cid];
      var liOrTrElement = view.el.parentNode;
      if(!!view && !!liOrTrElement && !!liOrTrElement.parentNode) {
        liOrTrElement.parentNode.removeChild(liOrTrElement);
      }
      delete(this.itemViews[model.cid]);

      // update the first / last class names
      this._updateClassNames();
    },

    _updateClassNames : function() {
      var children = this.collectionEl.childNodes;
      if(children.length > 0) {
        _(children).each(function(child) {
          $(child).removeClass('first');
          $(child).removeClass('last');
        });
        $(children[0]).addClass('first');
        $(children[children.length - 1]).addClass('last');
      }
    },

    _ensureProperPosition : function(view) {
      if(_(this.model.comparator).isFunction()) {
        this.model.sort({silent : true});
        var itemEl = view.el.parentNode;
        var currentIndex = _(this.collectionEl.childNodes).indexOf(itemEl, true);
        var properIndex = this.model.indexOf(view.model);
        if(currentIndex !== properIndex) {
          itemEl.parentNode.removeChild(itemEl);
          var refNode = this.collectionEl.childNodes[properIndex];
          if(refNode) {
            this.collectionEl.insertBefore(itemEl, refNode);
          }
          else {
            this.collectionEl.appendChild(itemEl);
          }
        }
      }
    }
  });
}());

(function(){
  window.Backbone.UI.DatePicker = Backbone.View.extend({

    options : {
      // a moment.js format : http://momentjs.com/docs/#/display/format
      format : 'MM/DD/YYYY',
      date : null,
      name : null,
      onChange : null
    },

    initialize : function() {
      $(this.el).addClass('date_picker');

      this._calendar = new Backbone.UI.Calendar({
        className : 'date_picker_calendar',
        model : this.model,
        property : this.options.content,
        onSelect : _(this._selectDate).bind(this)
      });
      $(this._calendar.el).hide();
      document.body.appendChild(this._calendar.el);

      $(this._calendar.el).autohide({
        ignoreInputs : true,
        leaveOpenTargets : [this._calendar.el]
      });

      // listen for model changes
      if(!!this.model && this.options.content) {
        this.model.bind('change:' + this.options.content, _(this.render).bind(this));
      }
    },

    render : function() {
      $(this.el).empty();

      this._textField = new Backbone.UI.TextField({
        name : this.options.name
      }).render();

      $(this._textField.input).click(_(this._showCalendar).bind(this));
      $(this._textField.input).keyup(_(this._dateEdited).bind(this));

      this.el.appendChild(this._textField.el);

      this._selectedDate = (!!this.model && !!this.options.content) ? 
        this.resolveContent() : this.options.date;
      
      if(!!this._selectedDate) {
        this._calendar.options.selectedDate = this._selectedDate;
        var dateString = moment(this._selectedDate).format(this.options.format);
        this._textField.setValue(dateString);
      }
      this._calendar.render();
      
      return this;
    },

    setEnabled : function(enabled) {
      this._textField.setEnabled(enabled);
    },

    getValue : function() {
      return this._selectedDate;
    },

    setValue : function(date) {
      this._selectedDate = date;
      var dateString = moment(date).format(this.options.format);
      this._textField.setValue(dateString);
      this._dateEdited();
    },

    _showCalendar : function() {
      $(this._calendar.el).show();
      $(this._calendar.el).alignTo(this._textField.el, 'bottom -left', 0, 2);
    },

    _hideCalendar : function() {
      $(this._calendar.el).hide();
    },

    _selectDate : function(date) {
      var month = date.getMonth() + 1;
      if(month < 10) month = '0' + month;

      var day = date.getDate();
      if(day < 10) day = '0' + day;

      var dateString = moment(date).format(this.options.format);
      this._textField.setValue(dateString);
      this._dateEdited();
      this._hideCalendar();

      return false;
    },

    _dateEdited : function(e) {
      var newDate = moment(this._textField.getValue(), this.options.format);
      this._selectedDate = newDate.toDate();

      // if the enter key was pressed or we've invoked this method manually, 
      // we hide the calendar and re-format our date
      if(!e || e.keyCode === Backbone.UI.KEYS.KEY_RETURN) {
        var newValue = moment(newDate).format(this.options.format);
        this._textField.setValue(newValue);
        this._hideCalendar();

        // update our bound model (but only the date portion)
        if(!!this.model && this.options.content) {
          var boundDate = this.resolveContent() || new Date();
          var updatedDate = new Date(boundDate.getTime());
          updatedDate.setMonth(newDate.month());
          updatedDate.setDate(newDate.date());
          updatedDate.setFullYear(newDate.year());
          _(this.model).setProperty(this.options.content, updatedDate);
        }

        if(_(this.options.onChange).isFunction()) {
          this.options.onChange(newValue);
        }
      }
    }
  });
}());
(function() {
  Backbone.UI.DragSession = function(options) {
    this.options = _.extend({
      // A mouse(move/down) event
      dragEvent : null,

      //The document in which the drag session should occur
      scope : null,

      //Sent when the session is ends up being a sloppy mouse click
      onClick: Backbone.UI.noop,

      // Sent when a drag session starts for real 
      // (after the mouse has moved SLOP pixels)
      onStart: Backbone.UI.noop,

      // Sent for each mouse move event that occurs during the drag session
      onMove: Backbone.UI.noop,

      // Sent when the session stops normally (the mouse was released)
      onStop: Backbone.UI.noop,

      // Sent when the session is aborted (ESC key pressed)
      onAbort: Backbone.UI.noop,

      // Sent when the drag session finishes, regardless of
      // whether it stopped normally or was aborted.
      onDone: Backbone.UI.noop
    }, options);

    if(Backbone.UI.DragSession.currentSession) {
      // Abort any existing drag session.  While this should never happen in
      // theory, in practice it happens a fair bit (e.g. if a mouseup occurs
      // outside the document).  So we don't complain about.
      Backbone.UI.DragSession.currentSession.abort();
    }

    this._doc = this.options.scope || document;

    this._handleEvent = _.bind(this._handleEvent, this);
    this._handleEvent(this.options.dragEvent);

    // Activate handlers
    this._activate(true);

    this.options.dragEvent.stopPropagation();

    /**
     * currentSession The currently active drag session.
     */
    Backbone.UI.DragSession.currentSession = this;
  };

  // add class methods 
  _.extend(Backbone.UI.DragSession, {
    SLOP : 2,

    BASIC_DRAG_CLASSNAME: 'dragging',

    // Enable basic draggable element behavior for absolutely positioned elements.
    // scope:     The window/document to enable dragging on.  Default is current document.
    // container: a container element to constrain dragging within
    // shield:    if true the draggable will use a shield iframe useful for 
    //            covering controls that bleed through zindex layers
    enableBasicDragSupport : function(scope, container, shield) {
      var d = scope ? (scope.document || scope) : document;
      if (d._basicDragSupportEnabled) return;
      d._basicDragSupportEnabled = true;
      // Enable "draggable"/"grabbable" classes
      $(d).bind('mousedown', function(e) {
        var el = e.target;

        // Ignore clicks that happen on anything the user might want to
        // interact with input elements
        var IGNORE = /(input|textarea|button|select|option)/i;
        if (IGNORE.exec(el.nodeName)) return;

        // Find the element to drag
        if (!el.hasClassName) return; // flash objects don't support this method
                                      // and should not be draggable
                                      // this fixes a problem in Shareflow in IE7
                                      // with the upload button
        var del = el.hasClassName('draggable') ? el : el.up('.draggable');
        del = del ? del.up('.draggable-container') || del : null;

        if (del) {
          // Get the allowable bounds to drag w/in
          // if (container) container = $(container);
          // var vp = container ? container.getBounds() : zen.util.Dom.getViewport(del.ownerDocument);
          //var vp = zen.util.Dom.getViewport(del.ownerDocument);
          var elb = del.getBounds();

          //  Create a new drag session
          var activeElement = document.activeElement;
          var ds = new Backbone.UI.DragSession({
            dragEvent : e, 
            scope : del.ownerDocument, 
            onStart : function(ds) {
              if (activeElement && activeElement.blur) activeElement.blur();
              ds.pos = del.positionedOffset();
              $(del).addClass(Backbone.UI.DragSession.BASIC_DRAG_CLASSNAME);
            },
            onMove : function(ds) {
              //elb.moveTo(ds.pos.left + ds.dx, ds.pos.top + ds.dy).constrainTo(vp);
              del.style.left = elb.x + 'px';
              del.style.top = elb.y + 'px';
            },
            onDone : function(ds) {
              if (activeElement && activeElement.focus) activeElement.focus();
              del.removeClassName(Backbone.UI.DragSession.BASIC_DRAG_CLASSNAME);
            }
          });
        }
      });
    }
  });

  // add instance methods
  _.extend(Backbone.UI.DragSession.prototype, {

    // Fire the onStop event and stop the drag session.
    stop: function() {
      this._stop();
    },

    // Fire the onAbort event and stop the drag session.
    abort: function() {
      this._stop(true);
    },

    // Activate the session by registering/unregistering event handlers
    _activate: function(flag) {
      var f = flag ? 'bind' : 'unbind';
      $(this._doc)[f]('mousemove', this._handleEvent);
      $(this._doc)[f]('mouseup', this._handleEvent);
      $(this._doc)[f]('keyup', this._handleEvent);
    },

    // All-in-one event handler for managing a drag session
    _handleEvent: function(e) {
      e.stopPropagation();
      e.preventDefault();

      this.x = e.pageX;
      this.y = e.pageY;

      if (e.type === 'mousedown') {
        // Absolute X of initial mouse down*/
        this.xStart = this.x;

        // Absolute Y of initial mouse down
        this.yStart = this.y;
      }

      // X-coord relative to initial mouse down
      this.dx = this.x - this.xStart;

      // Y-coord relative to initial mouse down
      this.dy = this.y - this.yStart;

      switch (e.type) {
        case 'mousemove':
          if (!this._dragging) {
            // Sloppy click?
            if(this.dx * this.dx + this.dy * this.dy >= Backbone.UI.DragSession.SLOP * Backbone.UI.DragSession.SLOP) {
              this._dragging = true;
              this.options.onStart(this, e);
            }
          } else {
            this.options.onMove(this, e);
          }
          break;
        case 'mouseup':
          if (!this._dragging) {
            this.options.onClick(this, e);
          } else {
            this.stop();
          }
          //this._stop();
          break;
        case 'keyup':
          if (e.keyCode !== Backbone.UI.KEYS.KEY_ESC) return;
          this.abort();
          break;
        default:
          return;
      }
    },

    // Stop the drag session
    _stop: function(abort) {
      Backbone.UI.DragSession.currentSession = null;

      // Deactivate handlers
      this._activate(false);

      if (this._dragging) {
        if (abort) {
          this.options.onAbort(this);
        } else {
          this.options.onStop(this);
        }
        this.options.onDone(this);
      }
    }
  });
}());

 // A mixin for dealing with collection alternatives
(function(){
  Backbone.UI.HasAlternativeProperty = {
    options : {
      // The collection of items representing alternative choices
      alternatives : null,

      // The property of the individual choice represent the the label to be displayed
      altLabelContent : null,

      // The property of the individual choice that represents the value to be stored
      // in the bound model's property.  Omit this option if you'd like the choice 
      // object itself to represent the value.
      altValueContent : null
    },

    _determineSelectedItem : function() {
      var item;

      // if a bound property has been given, we attempt to resolve it
      if(_(this.model).exists() && _(this.options.content).exists()) {
        item = _(this.model).resolveProperty(this.options.content);

        // if a value property is given, we further resolve our selected item
        if(_(this.options.altValueContent).exists()) {
          var otherItem = _(this._collectionArray()).detect(function(collectionItem) {
            return (collectionItem.attributes || collectionItem)[this.options.altValueContent] === item;
          }, this);
          if(!_(otherItem).isUndefined()) item = otherItem;
        }
      }

      return item || this.options.selectedItem;
    },

    _setSelectedItem : function(item, silent) {
      this.selectedValue = item;
      this.selectedItem = item;

      if(_(this.model).exists() && _(this.options.content).exists()) {
        this.selectedValue = this._valueForItem(item);
        _(this.model).setProperty(this.options.content, this.selectedValue, silent);
      }
    },

    _valueForItem : function(item) {
      return _(this.options.altValueContent).exists() ? 
        _(item).resolveProperty(this.options.altValueContent) :
        item;
    },

    _collectionArray : function() {
      return _(this.options.alternatives).exists() ?
        this.options.alternatives.models || this.options.alternatives : [];
    },

    _observeCollection : function(callback) {
      if(_(this.options.alternatives).exists() && _(this.options.alternatives.bind).exists()) {
        var key = 'change';
        this.options.alternatives.unbind(key, callback);
        this.options.alternatives.bind(key, callback);
      }
    }
  };
}());

 // A mixin for those views that are model bound
(function(){
  Backbone.UI.HasModel = {
    
    options : {
      // The Backbone.Model instance the view is bound to
      model : null,

      // The property of the bound model this component should render / update.
      // If a function is given, it will be invoked with the model and will 
      // expect an element to be returned.  If no model is present, this 
      // property may be a string or function describing the content to be rendered
      content : null
    },

    _observeModel : function(callback) {
      if(_(this.model).exists() && _(this.model.unbind).isFunction()) {
        _(['content', 'labelContent']).each(function(prop) {
          var key = this.options[prop];
          if(_(key).exists()) {
            key = 'change:' + key;
            this.model.unbind(key, callback);
            this.model.bind(key, callback);
          }
        }, this);
      }
    }
  };
}());

/*
    jQuery `input` special event v1.2
    http://whattheheadsaid.com/projects/input-special-event

    (c) 2010-2011 Andy Earnshaw
    forked by dodo (https://github.com/dodo)
    MIT license
    www.opensource.org/licenses/mit-license.php
*/
(function($, udf) {
    var ns = ".inputEvent ",
        // A bunch of data strings that we use regularly
        dataBnd = "bound.inputEvent",
        dataVal = "value.inputEvent",
        dataDlg = "delegated.inputEvent",
        // Set up our list of events
        bindTo = [
            "input", "textInput",
            "propertychange",
            "paste", "cut",
            "keydown", "keyup",
            "drop",
        ""].join(ns),
        // Events required for delegate, mostly for IE support
        dlgtTo = [ "focusin", "mouseover", "dragstart", "" ].join(ns),
        // Elements supporting text input, not including contentEditable
        supported = {TEXTAREA:udf, INPUT:udf},
        // Events that fire before input value is updated
        delay = { paste:udf, cut:udf, keydown:udf, drop:udf, textInput:udf };

    // this checks if the tag is supported or has the contentEditable property
    function isSupported(elem) {
        return $(elem).prop('contenteditable') == "true" ||
                 elem.tagName in supported;
    };

    $.event.special.txtinput = {
        setup: function(data, namespaces, handler) {
            var timer,
                bndCount,
                // Get references to the element
                elem  = this,
                $elem = $(this),
                triggered = false;

            if (isSupported(elem)) {
                bndCount = $.data(elem, dataBnd) || 0;

                if (!bndCount)
                    $elem.bind(bindTo, handler);

                $.data(elem, dataBnd, ++bndCount);
                $.data(elem, dataVal, elem.value);
            } else {
                $elem.bind(dlgtTo, function (e) {
                    var target = e.target;
                    if (isSupported(target) && !$.data(elem, dataDlg)) {
                        bndCount = $.data(target, dataBnd) || 0;

                        if (!bndCount)
                            $(target).bind(bindTo, handler);

                        // make sure we increase the count only once for each bound ancestor
                        $.data(elem, dataDlg, true);
                        $.data(target, dataBnd, ++bndCount);
                        $.data(target, dataVal, target.value);
                    }
                });
            }
            function handler (e) {
                var elem = e.target;

                // Clear previous timers because we only need to know about 1 change
                window.clearTimeout(timer), timer = null;

                // Return if we've already triggered the event
                if (triggered)
                    return;

                // paste, cut, keydown and drop all fire before the value is updated
                if (e.type in delay && !timer) {
                    // ...so we need to delay them until after the event has fired
                    timer = window.setTimeout(function () {
                        if (elem.value !== $.data(elem, dataVal)) {
                            $(elem).trigger("txtinput");
                            $.data(elem, dataVal, elem.value);
                        }
                    }, 0);
                }
                else if (e.type == "propertychange") {
                    if (e.originalEvent.propertyName == "value") {
                        $(elem).trigger("txtinput");
                        $.data(elem, dataVal, elem.value);
                        triggered = true;
                        window.setTimeout(function () {
                            triggered = false;
                        }, 0);
                    }
                }
                else {
                    $(elem).trigger("txtinput");
                    $.data(elem, dataVal, elem.value);
                    triggered = true;
                    window.setTimeout(function () {
                        triggered = false;
                    }, 0);
                }
            }
        },
        teardown: function () {
            var elem = $(this);
            elem.unbind(dlgtTo);
            elem.find("input, textarea").andSelf().each(function () {
                bndCount = $.data(this, dataBnd, ($.data(this, dataBnd) || 1)-1);

                if (!bndCount)
                    elem.unbind(bindTo);
            });
        }
    };

    // Setup our jQuery shorthand method
    $.fn.input = function (handler) {
        return handler ? $(this).bind("txtinput", handler) : this.trigger("txtinput");
    }
})(jQuery);
(function(){
  window.Backbone.UI.Label = Backbone.View.extend({
    options : {
      tagName : 'span'
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);

      _(this).bindAll('render');

      $(this.el).addClass('label');

    },

    render : function() {
      var labelText = this.resolveContent();

      this._observeModel(this.render);

      $(this.el).empty();
      
      // insert label
      this.el.appendChild(document.createTextNode(labelText));

      return this;
    }
    
  });
}());

(function(){
  window.Backbone.UI.Link = Backbone.View.extend({
    options : {
      tagName : 'a',

      // disables the link (non-clickable) 
      disabled : false,

      // A callback to invoke when the link is clicked
      onClick : null
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);

      _(this).bindAll('render');

      $(this.el).addClass('link');

      $(this.el).bind('click', _(function(e) {
        if(!this.options.disabled && this.options.onClick) {
          this.options.onClick(e); 
        }
        return false;
      }).bind(this));
    },

    render : function() {
      var labelText = this.resolveContent();

      this._observeModel(this.render);

      $(this.el).empty();
      
      // insert label
      this.el.appendChild($.el.span({className : 'label'}, labelText));
      
      // add appropriate class names
      this.setEnabled(!this.options.disabled);

      return this;
    },

    // sets the enabled state of the button
    setEnabled : function(enabled) {
      if(enabled) {
        this.el.href = '#';
      } else { 
        this.el.removeAttribute('href');
      }
      this.options.disabled = !enabled;
      $(this.el)[enabled ? 'removeClass' : 'addClass']('disabled');
    }
  });
}());

(function(){
  window.Backbone.UI.List = Backbone.UI.CollectionView.extend({
    options : {
      // A Backbone.View implementation describing how to render a particular 
      // item in the collection.  For simple use cases, you can pass a String 
      // instead which will be interpreted as the property of the model to display.
      itemView : null
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
      $(this.el).addClass('list');
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      this.collectionEl = $.el.ul();

      // if the collection is empty, we render the empty content
      if(!_(this.model).exists()  || this.model.length === 0) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ? 
          this.options.emptyContent() : this.options.emptyContent;
        this._emptyContent = $.el.li(this._emptyContent);

        if(!!this._emptyContent) {
          this.collectionEl.appendChild(this._emptyContent);
        }
      }

      // otherwise, we render each row
      else {
        _(this.model.models).each(function(model, index) {
          var item = this._renderItem(model, index);
          this.collectionEl.appendChild(item);
        }, this);
      }

      // wrap the list in a scroller
      if(_(this.options.maxHeight).exists()) {
        var style = 'max-height:' + this.options.maxHeight + 'px';
        var scroller = new Backbone.UI.Scroller({
          content : $.el.div({style : style}, this.collectionEl) 
        }).render();

        this.el.appendChild(scroller.el);
      }
      else {
        this.el.appendChild(this.collectionEl);
      }

      this._updateClassNames();

      return this;
    },

    // renders an item for the given model, at the given index
    _renderItem : function(model, index) {
      var content;
      if(_(this.options.itemView).exists()) {

        if(_(this.options.itemView).isString()) {
          content = this.resolveContent(model, this.options.itemView);
        }

        else {
          var view = new this.options.itemView({
            model : model
          });
          view.render();
          this.itemViews[model.cid] = view;
          content = view.el;
        }
      }

      var item = $.el.li(content);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(item).click(_(this.options.onItemClick).bind(this, model));
      }

      return item;
    }
  });
}());

(function(){
  window.Backbone.UI.Menu = Backbone.View.extend({

    options : {
      // an additional item to render at the top of the menu to 
      // denote the lack of a selection
      emptyItem : null
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);

      _(this).bindAll('render');

      $(this.el).addClass('menu');

      this._textField = new Backbone.UI.TextField().render();
    },

    scroller : null,

    render : function() {
      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      // create a new list of items
      var list = $.el.ul();

      // add entry for the empty model if it exists
      if(!!this.options.emptyItem) {
        this._addItemToMenu(list, this.options.emptyItem);
      }

      var selectedItem = this._determineSelectedItem();

      _(this._collectionArray()).each(function(item) {
        var selectedValue = this._valueForItem(selectedItem);
        var itemValue = this._valueForItem(item);
        this._addItemToMenu(list, item, _(selectedValue).isEqual(itemValue));
      }, this);

      // wrap them up in a scroller 
      this.scroller = new Backbone.UI.Scroller({
        content : list
      }).render();

      // Prevent scroll events from percolating out to the enclosing doc
      $(this.scroller.el).bind('mousewheel', function(){return false;});
      $(this.scroller.el).addClass('menu_scroller');

      this.el.appendChild(this.scroller.el);
      
      return this;
    },

    scrollToSelectedItem : function() {
      var pos = !this._selectedAnchor ? 0 : 
        $(this._selectedAnchor.parentNode).position().top - 10;
      this.scroller.setScrollPosition(pos);
    },

    width : function() {
      return $(this.scroller.el).innerWidth();
    },

    // Adds the given item (creating a new li element) 
    // to the given menu ul element
    _addItemToMenu : function(menu, item, select) {
      var anchor = $.el.a({href : '#'});
      
      var liElement = $.el.li(anchor);
      $.el.span(this._labelForItem(item) || '\u00a0').appendTo(anchor);
      
      var clickFunction = _.bind(function(e, silent) {
        if(!!this._selectedAnchor) $(this._selectedAnchor).removeClass('selected');

        this._setSelectedItem(_(item).isEqual(this.options.emptyItem) ? null : item, silent);
        this._selectedAnchor = anchor;
        $(anchor).addClass('selected');

        if(_(this.options.onChange).isFunction()) this.options.onChange(item);
        return false;
      }, this);

      $(anchor).click(clickFunction);

      if(select) clickFunction(null, true);

      menu.appendChild(liElement);
    },

    _labelForItem : function(item) {
      return !_(item).exists() ? this.options.placeholder : 
        this.resolveContent(item, this.options.altLabelContent);
    }
  });
}());
(function(){
  window.Backbone.UI.Pulldown = Backbone.View.extend({
    options : {
      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',

      // If true, the menu will be aligned to the right side
      alignRight : false,

      // A callback to invoke with a particular item when that item is
      // selected from the pulldown menu.
      onChange : Backbone.UI.noop,

      // A callback to invoke when the pulldown menu is shown, passing the 
      // button click event.
      onMenuShow : Backbone.UI.noop,

      // A callback to invoke when the pulldown menu is hidden, if the menu was hidden
      // as a result of a second click on the pulldown button, the button click event 
      // will be passed.
      onMenuHide : Backbone.UI.noop,

      // an additional item to render at the top of the menu to 
      // denote the lack of a selection
      emptyItem : null
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);
      _(this).bindAll('render');

      $(this.el).addClass('pulldown');

      var onChange = this.options.onChange;
      delete(this.options.onChange);
      var menuOptions = _(this.options).extend({
        onChange : _(function(item){
          this._onItemSelected(item);
          if(_(onChange).isFunction()) onChange(item);
        }).bind(this)
      });

      this._menu = new Backbone.UI.Menu(menuOptions).render();
      $(this._menu.el).autohide({
        ignoreKeys : [Backbone.UI.KEYS.KEY_UP, Backbone.UI.KEYS.KEY_DOWN], 
        ignoreInputs : false,
        hideCallback : _.bind(this._onAutoHide, this)
      });
      $(this._menu.el).hide();
      document.body.appendChild(this._menu.el);
    },

    // public accessors 
    button : null,

    render : function() {
      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      var item = this._menu.selectedItem;
      var label = this._labelForItem(item);
      this.button = new Backbone.UI.Button({
        className  : 'pulldown_button',
        model : {label : this._labelForItem(item)},
        content : 'label',
        onClick    : _.bind(this.showMenu, this)
      }).render();
      this.el.appendChild(this.button.el);

      return this;
    },

    setEnabled : function(enabled) {
      if(this.button) this.button.setEnabled(enabled);
    },

    _labelForItem : function(item) {
      return !_(item).exists() ? this.options.placeholder : 
        this.resolveContent(item, this.options.altLabelContent);
    },

    // sets the selected item
    setSelectedItem : function(item) {
      this._setSelectedItem(item);
      this.button.options.label = this._labelForItem(item);
      this.button.render();
    },

    // Forces the menu to hide
    hideMenu : function(event) {
      $(this._menu.el).hide();
      if(this.options.onMenuHide) this.options.onMenuHide(event);
    },
    
    //forces the menu to show
    showMenu : function(e) {
      var anchor = this.button.el;
      var showOnTop = $(window).height() - ($(anchor).offset().top - document.body.scrollTop) < 150;
      var position = (this.options.alignRight ? '-right' : '-left') + (showOnTop ? 'top' : ' bottom');
      $(this._menu.el).alignTo(anchor, position, 0, 1);
      $(this._menu.el).show();
      
      this._menuWidth = this._menuWidth || this._menu.width();
      var buttonWidth = $(this.button.el).innerWidth();
      $(this._menu.el).css({width : Math.max(this._menuWidth, buttonWidth)});
      if(this.options.onMenuShow) this.options.onMenuShow(e);
      this._menu.scrollToSelectedItem();
    },

    _onItemSelected : function(item) {
      if(!!this.button) {
        $(this.el).removeClass('placeholder');
        this.button.model = {label : this._labelForItem(item)};
        this.button.render();
        this.hideMenu();
      }
    },

    // notify of the menu hiding
    _onAutoHide : function() {
      if(this.options.onMenuHide) this.options.onMenuHide();
      return true;
    }
    
  });
}());
(function(){
  window.Backbone.UI.RadioGroup = Backbone.View.extend({

    options : {
      // A callback to invoke with the selected item whenever the selection changes
      onChange : Backbone.UI.noop
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);
      _(this).bindAll('render');
      
      $(this.el).addClass('radio_group');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
    },

    // public accessors
    selectedItem : null,

    render : function() {

      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem() || this.selectedItem;

      var ul = $.el.ul();
      var selectedValue = this._valueForItem(this.selectedItem);
      _(this._collectionArray()).each(function(item) {

        var selected = selectedValue === this._valueForItem(item);

        var label = this.resolveContent(item, this.options.altLabelContent);
        if(label.nodeType === 1) {
          $('a',label).click(function(e){
            e.stopPropagation(); 
          });
        }
        
        var li = $.el.li(
          $.el.a({className : 'choice' + (selected ? ' selected' : '')},
            $.el.div({className : 'mark' + (selected ? ' selected' : '')}, 
              selected ? '\u25cf' : '\u00a0')));      
        
        // insert label into li then add to ul
        $.el.div({className : 'label'}, label).appendTo(li);
        ul.appendChild(li);

        $(li).bind('click', _.bind(this._onChange, this, item));
        
      }, this);
      this.el.appendChild(ul);

      return this;
    },

    _onChange : function(item) {
      this._setSelectedItem(item);
      this.render();

      if(_(this.options.onChange).isFunction()) this.options.onChange(item);
      return false;
    }
  });
}());
(function(){

  window.Backbone.UI.Scroller = Backbone.View.extend({
    options : {
      className : 'scroller',

      // The content to be scrolled.  This element should be 
      // of a fixed height.
      content : null,

      // The amount to scroll on each wheel click
      scrollAmount : 5,

      // A callback to invoke when scrolling occurs
      onScroll : null
    },

    initialize : function() {
      Backbone.UI.DragSession.enableBasicDragSupport();
      setInterval(_(this.update).bind(this), 40);
    },

    render : function () {
      $(this.el).empty();
      $(this.el).addClass('scroller');

      this._scrollContent = this.options.content; 
      $(this._scrollContent).addClass('content');

      this._knob = $.el.div({className : 'knob'},
        $.el.div({className : 'knob_top'}),
        $.el.div({className : 'knob_middle'}),
        $.el.div({className : 'knob_bottom'}));

      this._tray = $.el.div({className : 'tray'});
      this._tray.appendChild(this._knob);

      // for firefox on windows we need to wrap the scroller content in an overflow
      // auto div to avoid a rendering bug that causes artifacts on the screen when
      // the hidden content is scrolled...wsb
      this._scrollContentWrapper = $.el.div({className : 'content_wrapper'});
      this._scrollContentWrapper.appendChild(this._scrollContent);

      this.el.appendChild(this._tray);
      this.el.appendChild(this._scrollContentWrapper);

      // FF workaround: Set tabIndex so the user can click on the div to give
      // it focus (which allows us to capture the up/down/pageup/pagedown
      // keys).  (And setting it to -1 keeps it out of the tab-navigation
      // chain)
      this.el.tabIndex = -1;

      // observe events
      $(this._knob).bind('mousedown', _.bind(this._onKnobMouseDown, this));
      $(this._tray).bind('click', _.bind(this._onTrayClick, this));
      $(this.el).bind('mousewheel', _.bind(this._onMouseWheel, this));

      // touch events if appropriates
      if(Backbone.UI.IS_MOBILE) {
        $(this._scrollContent).css({
          overflow : 'scroll',
          '-webkit-overflow-scrolling' : 'touch'
        });
      }
      $(this.el).addClass('disabled');

      return this;
    },
    
    // Returns the scroll position as a ratio of position relative to
    // overall content size. 0 = at top, 1 = at bottom.
    scrollRatio: function() {
      return this.scrollPosition()/(this._totalHeight - this._visibleHeight);
    },

    setScrollRatio: function(ratio) {
      var overflow = (this._totalHeight - this._visibleHeight);
      ratio = Math.max(0, Math.min(overflow > 0 ? 1 : 0, ratio));
      var contentPos = ratio*overflow;

      this._scrollContent.scrollTop = Math.round(contentPos);

      if(this.options.onScroll) this.options.onScroll();

      // FF workaround: with position relative set on the container (needed to
      // float the scrollbar properly), scrolling performance suh-hucks!
      // However updating the knob position in a timeout dramatically improves
      // matters. Don't ask me why!
      setTimeout(_.bind(this._updateKnobPosition, this), 10);
      this._updateKnobPosition();
    },

    // Scrolls the content by the given amount
    scrollBy: function(amount) {
      this.setScrollPosition(this.scrollPosition() + amount);
    },

    // Returns the actual scroll position
    scrollPosition: function() {
      return this._scrollContent.scrollTop;
    },

    setScrollPosition: function(top) {
      this.update();
      var h = this._totalHeight - this._visibleHeight;
      this.setScrollRatio(h ? top/h : 0);
      this.update();
    },

    // Scrolls to the end of the content
    scrollToEnd : function(){
      this.setScrollRatio(1);
    },
    
    // updates and resizes the scrollbar if changes to the scroll 
    update: function() {
      var visibleHeight = this._scrollContent.offsetHeight;
      var totalHeight = this._scrollContent.scrollHeight;

      this.maxY = $(this._tray).height() - $(this._knob).height();

      // if either the offset or scroll height has changed
      if(this._visibleHeight !== visibleHeight || this._totalHeight !== totalHeight) {
        this._disabled = totalHeight <= visibleHeight + 2;
        $(this.el).toggleClass('disabled', this._disabled || Backbone.UI.IS_MOBILE);
        this._visibleHeight = visibleHeight;
        this._totalHeight = totalHeight;

        // if there's nothing to scroll, we disable the scroll bar
        if(this._totalHeight >= this._visibleHeight) {
          this._updateKnobSize();
          this.minY = 0;
        }
      }
      this._updateKnobPosition();
      this._updateKnobSize();
    },

    // Set the position of the knob to reflect the current scroll position
    _updateKnobPosition: function() {
      var r = this.scrollRatio();
      var y = this.minY + (this.maxY-this.minY) * r;
      if (!isNaN(y)) this._knob.style.top = y + 'px';
    },
    
    _updateKnobSize : function(){
      var knobSize = $(this._tray).height() * (this._visibleHeight/this._totalHeight);
      knobSize = knobSize > 20 ? knobSize : 20;
      $(this._knob).css({height : knobSize + 'px'});
    },

    _knobRatio: function(top) {
      top = top || this._knob.offsetTop;
      top = Math.max(this.minY, Math.min(this.maxY, top));
      return (top-this.minY) / (this.maxY - this.minY);
    },
    
    _onTrayClick: function(e) {
      e = e || event;
      if(e.target === this._tray) {
        var y = (e.layerY || e.y);
        if(!y) y = (e.originalEvent.layerY || e.originalEvent.y);
        y = y - this._knob.offsetHeight/2;
        this.setScrollRatio(this._knobRatio(y));
      }
      e.stopPropagation();
    },

    _onKnobMouseDown : function(e) {
      this.el.focus();
      var ds = new Backbone.UI.DragSession({
        dragEvent : e, 
        scope : this.el.ownerDocument,

        onStart : _.bind(function(ds) {
          // Cache starting position of the knob
          ds.pos = this._knob.offsetTop;
          ds.scroller = this;
          $(this.el).addClass('dragging');
        }, this),

        onMove : _.bind(function(ds) {
          var ratio = this._knobRatio(ds.pos + ds.dy);
          this.setScrollRatio(ratio);
        }, this),

        onStop : _.bind(function(ds) {
          $(this.el).removeClass('dragging');
        }, this)
      });
      e.stopPropagation();
    },
    
    _onMouseWheel: function(e, delta, deltaX, deltaY) {
      if(!this._disabled) {
        var step = this.options.scrollAmount;
        this.setScrollPosition(this.scrollPosition() - delta*step);
        e.preventDefault();
        return false;
      }
    }

  });
}());



(function() {
  Backbone.UI.TabSet = Backbone.View.extend({
    options : {
      // Tabs to initially add to this tab set.  Each entry may contain
      // a <code>label</code>, <code>content</code>, and <code>onActivate</code>
      // option.
      alternatives : [],

      // The index of the tab to initially select
      selectedTab : 0
    },

    initialize : function() {
      $(this.el).addClass('tab_set');
    }, 

    render : function() {
      $(this.el).empty();

      this._tabs = [];
      this._contents = [];
      this._callbacks = [];
      this._tabBar = $.el.div({className : 'tab_bar'});
      this._contentContainer = $.el.div({className : 'content_container'});
      this.el.appendChild(this._tabBar);
      this.el.appendChild(this._contentContainer);

      for(var i=0; i<this.options.alternatives.length; i++) {
        this.addTab(this.options.alternatives[i]);
      }

      if(this.options.selectedTab >= 0){
        this.activateTab(this.options.selectedTab);
      }
      else{
        $(this.el).addClass('no_selection');
      }

      return this; 
    },

    addTab : function(tabOptions) {
      var tab = $.el.a({href : '#', className : 'tab'});
      if(tabOptions.className) $(tab).addClass(tabOptions.className);
      
      var label = this.resolveContent(null, tabOptions.label);
      tab.appendChild(_(label).isString() ? document.createTextNode(label || '') : label);
      
      this._tabBar.appendChild(tab);
      this._tabs.push(tab);

      var content = !!tabOptions.content && !!tabOptions.content.nodeType ? 
        tabOptions.content : 
        $.el.div(tabOptions.content);
      this._contents.push(content);
      $(content).hide();
      this._contentContainer.appendChild(content);

      // observe tab clicks
      var index = this._tabs.length - 1;
      $(tab).bind('click', _.bind(function() {
        this.activateTab(index);
        return false;
      }, this));

      this._callbacks.push(tabOptions.onActivate || Backbone.UI.noop);
    },

    activateTab : function(index) {
      
      $(this.el).removeClass('no_selection');
      
      // hide all content panels
      _(this._contents).each(function(content) {
        $(content).hide();
      });

      // de-select all tabs
      _(this._tabs).each(function(tab) {
        $(tab).removeClass('selected');
      });

      if(_(this._selectedIndex).exists()) {
        $(this.el).removeClass('index_' + this._selectedIndex);
      }
      $(this.el).addClass('index_' + index);
      this._selectedIndex = index;

      // select the appropriate tab
      $(this._tabs[index]).addClass('selected');

      // show the proper contents
      $(this._contents[index]).show();

      this._callbacks[index]();
    },
    
    // returns the index of the selectedTab
    // or -1 if no tab is selected
    getActiveTab : function(){
      return _(this._tabs).indexOf(_(this._tabs).find(function(tab){ return $(tab).hasClass('selected') }));
    }
  });
}());

(function(){
  window.Backbone.UI.TableView = Backbone.UI.CollectionView.extend({
    options : {
      // Each column should contain a <code>title</code> property to
      // describe the column's heading, a <code>content</code> property to
      // declare which property the cell is bound to, an optional two-argument
      // <code>comparator</code> with which to sort each column if the
      // table is sortable, and an optional <code>width</code> property to
      // declare the width of the column in pixels.
      columns : [],

      // A string, element, or function describing what should be displayed
      // when the table is empty.
      emptyContent : 'no entries',

      // A callback to invoke when a row is clicked.  If this callback
      // is present, the rows will highlight on hover.
      onItemClick : Backbone.UI.noop,

      // Clicking on the column headers will sort the table. See
      // <code>comparator</code> property description on columns.
      // The table is sorted by the first column by default.
      sortable : false,

      // A callback to invoke when the table is to be sorted. The callback will
      // be passed the <code>column</code> on which to sort.
      onSort : null
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
      $(this.el).addClass('table_view');
      this._sortState = {reverse : true};
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      var container = $.el.div({className : 'content'},
        this.collectionEl = $.el.table({
          cellPadding : '0',
          cellSpacing : '0'
        }));

      $(this.el).toggleClass('clickable', this.options.onItemClick !== Backbone.UI.noop);

      // generate a table row for our headings
      var headingRow = $.el.tr();
      var sortFirstColumn = false;
      var firstHeading = null;
      _(this.options.columns).each(_(function(column, index, list) {
        var label = _(column.title).isFunction() ? column.title() : column.title;
        var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
        var style = width ? 'width:' + width + 'px; max-width:' + width + 'px; ' : '';
        style += this.options.sortable ? 'cursor: pointer; ' : '';
        column.comparator = _(column.comparator).isFunction() ? column.comparator : function(item1, item2) {
          return item1.get(column.content) < item2.get(column.content) ? -1 :
            item1.get(column.content) > item2.get(column.content) ? 1 : 0;
        };
        var firstSort = (sortFirstColumn && firstHeading === null);
        var sortHeader = this._sortState.content === column.content || firstSort;
        var sortLabel = $.el.div({
          className : 'glyph'
        }, sortHeader ? (this._sortState.reverse && !firstSort ? '\u25b2 ' : '\u25bc ') : '');

        var onclick = this.options.sortable ? (_(this.options.onSort).isFunction() ?
          _(function(e) { this.options.onSort(column); }).bind(this) :
          _(function(e, silent) { this._sort(column, silent); }).bind(this)) : Backbone.UI.noop;

        var th = $.el.th({
            className : _(list).nameForIndex(index), 
            style : style, 
            onclick : onclick
          }, 
          sortLabel, 
          $.el.div({
            className : 'wrapper' + (sortHeader ? ' sorted' : '')
          }, label)).appendTo(headingRow);

        if (firstHeading === null) firstHeading = th;
      }).bind(this));
      if (sortFirstColumn && !!firstHeading) {
        firstHeading.onclick(null, true);
      }

      // Add the heading row to it's very own table so we can allow the
      // actual table to scroll with a fixed heading.
      this.el.appendChild($.el.table({
          className : 'heading',
          cellPadding : '0',
          cellSpacing : '0'
        }, $.el.thead(headingRow)));

      // now we'll generate the body of the content table, with a row
      // for each model in the bound collection
      var tableBody = $.el.tbody();
      this.collectionEl.appendChild(tableBody);

      // if the collection is empty, we render the empty content
      if(!_(this.model).exists()  || this.model.length === 0) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ?
          this.options.emptyContent() : this.options.emptyContent;
        this._emptyContent = $.el.tr($.el.td(this._emptyContent));

        if(!!this._emptyContent) {
          tableBody.appendChild(this._emptyContent);
        }
      }

      // otherwise, we render each row
      else {
        _(this.model.models).each(function(model, index) {
          var item = this._renderItem(model, index);
          tableBody.appendChild(item);
        }, this);
      }

      // wrap the list in a scroller
      if(_(this.options.maxHeight).exists()) {
        var style = 'max-height:' + this.options.maxHeight + 'px';
        var scroller = new Backbone.UI.Scroller({
          content : $.el.div({style : style}, container)
        }).render();

        this.el.appendChild(scroller.el);
      }
      else {
        this.el.appendChild(container);
      }

      this._updateClassNames();

      return this;
    },

    _renderItem : function(model, index) {
      var row = $.el.tr();

      // for each model, we walk through each column and generate the content
      _(this.options.columns).each(function(column, index, list) {
        var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
        var style = width ? 'width:' + width + 'px; max-width:' + width + 'px': null;
        var content = this.resolveContent(model, column.content);
        row.appendChild($.el.td({
          className : _(list).nameForIndex(index), 
          style : style
        }, $.el.div({className : 'wrapper', style : style}, content)));
      }, this);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(row).click(_(this.options.onItemClick).bind(this, model));
      }

      this.itemViews[model.cid] = row;
      return row;
    },

    _sort : function(column, silent) {
      this._sortState.reverse = !this._sortState.reverse;
      this._sortState.content = column.content;
      var comp = column.comparator;
      if (this._sortState.reverse) {
        comp = function(item1, item2) {
          return -column.comparator(item1, item2);
        };
      }
      this.model.comparator = comp;
      this.model.sort({silent : !!silent});
    }
  });
}());

(function(){
  window.Backbone.UI.TextArea = Backbone.View.extend({
    options : {
      className : 'text_area',

      // id to use on the actual textArea 
      textAreaId : null,

      // disables the text area
      disabled : false,
      
      enableScrolling : true,

      tabIndex : null 
    },

    // public accessors
    textArea : null,

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);
      
      $(this.el).addClass('text_area');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
    },

    render : function() {
      var value = (this.textArea && this.textArea.value.length) > 0 ? 
        this.textArea.value : this.resolveContent();

      $(this.el).empty();

      this.textArea = $.el.textarea({
        id : this.options.textAreaId,
        tabIndex : this.options.tabIndex, 
        placeholder : this.options.placeholder}, value);

      this._observeModel(_(this._refreshValue).bind(this));

      var content = this.textArea;
      if(this.options.enableScrolling) {
        this._scroller = new Backbone.UI.Scroller({
          content : this.textArea
        }).render();
        content = this._scroller.el;
      }

      this.el.appendChild(content);

      this.setEnabled(!this.options.disabled);

      $(this.textArea).input(_.bind(function() {
        _.defer(_(this._updateModel).bind(this));
      }, this));

      return this;
    },

    getValue : function() {
      return this.textArea.value;
    },

    setValue : function(value) {
      $(this.textArea).empty();
      this.textArea.value = value;
      this._updateModel();
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      if(enabled) {
        $(this.el).removeClass('disabled');
      } else {
        $(this.el).addClass('disabled');
      }
      this.textArea.disabled = !enabled;
    },

    _updateModel : function() {
      _(this.model).setProperty(this.options.content, this.textArea.value);
    },

    _refreshValue : function() {
      var newValue = this.resolveContent();
      if(this.textArea && this.textArea.value !== newValue) {
        this.textArea.value = _(newValue).exists() ? newValue : null;
      }
    }
  });
}());
(function(){
  window.Backbone.UI.TextField = Backbone.View.extend({
    options : {
      // disables the input text
      disabled : false,
      
      // The type of input (text, password, number, email, etc.)
      type : 'text',

      // the value to use for both the name and id attribute 
      // of the underlying input element
      name : null,

      // the tab index to set on the underlying input field
      tabIndex : null,

      // a callback to invoke when a key is pressed within the text field
      onKeyPress : Backbone.UI.noop,

      // if given, the text field will limit it's character count
      maxLength : null
    },

    // public accessors
    input : null,

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);
      _(this).bindAll('_refreshValue');
    
      $(this.el).addClass('text_field');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }

      this.input = $.el.input({maxLength : this.options.maxLength});

      $(this.input).keyup(_(function(e) {
        if(_(this.options.onKeyPress).exists() && _(this.options.onKeyPress).isFunction()) {
          this.options.onKeyPress(e, this);
        }
      }).bind(this));

      $(this.input).input(_(this._updateModel).bind(this));

      this._observeModel(this._refreshValue);
    },

    render : function() {
      var value = (this.input && this.input.value.length) > 0 ? 
        this.input.value : this.resolveContent();

      $(this.el).empty();

      $(this.input).attr({
        type : this.options.type ? this.options.type : 'text',
        name : this.options.name,
        id : this.options.name,
        tabIndex : this.options.tabIndex,
        placeholder : this.options.placeholder,
        value : value});

      // insert text_wrapper
      this.el.appendChild($.el.div({className : 'input_wrapper'}, this.input));

      this.setEnabled(!this.options.disabled);

      return this;
    },

    getValue : function() {
      return this.input.value;
    },

    setValue : function(value) {
      this.input.value = value;
      this._updateModel();
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      if(enabled) { 
        $(this.el).removeClass('disabled');
      } else {
        $(this.el).addClass('disabled');
      }
      this.input.disabled = !enabled;
    },

    _updateModel : function() {
      _(this.model).setProperty(this.options.content, this.input.value);
    },

    _refreshValue : function() {
      var newValue = this.resolveContent();
      if(this.input && this.input.value !== newValue) {
        this.input.value = _(newValue).exists() ? newValue : null;
      }
    }
  });
}());

(function(){
  window.Backbone.UI.TimePicker = Backbone.View.extend({

    options : {
      // a moment.js format : http://momentjs.com/docs/#/display/format
      format : 'hh:mm a',

      // minute interval to use for pulldown menu
      interval : 30,

      // the name given to the text field's input element
      name : null,
      
      // text field is disabled or enabled
      disabled : false
    },

    initialize : function() {
      $(this.el).addClass('time_picker');

      this._timeModel = {};
      this._menu = new Backbone.UI.Menu({
        model : this._timeModel,
        altLabelContent : 'label',
        altValueContent : 'label',
        content : 'value',
        onChange : _(this._onSelectTimeItem).bind(this)
      });
      $(this._menu.el).hide();
      $(this._menu.el).autohide({
        ignoreInputs : true
      });
      document.body.appendChild(this._menu.el);

      // listen for model changes
      if(!!this.model && this.options.content) {
        this.model.bind('change:' + this.options.content, _(this.render).bind(this));
      }
    },

    render : function() {
      $(this.el).empty();

      this._textField = new Backbone.UI.TextField({
        name : this.options.name,
        disabled : this.options.disabled 
      }).render();
      $(this._textField.input).click(_(this._showMenu).bind(this));
      $(this._textField.input).keyup(_(this._timeEdited).bind(this));
      this.el.appendChild(this._textField.el);

      var date = this.resolveContent();
      
      if(!!date) {
        var value = moment(date).format(this.options.format);
        this._textField.setValue(value);
        this._timeModel.value = value;
        this._selectedTime = date;
      }

      this._menu.options.alternatives = this._collectTimes();
      this._menu.options.model = this._timeModel;
      this._menu.render();
      
      return this;
    },

    getValue : function() {
      return this._selectedTime;
    },

    setValue : function(time) {
      this._selectedTime = time;
      var timeString = moment(time).format(this.options.format);
      this._textField.setValue(timeString);
      this._timeEdited();

      this._menu.options.selectedValue = time;
      this._menu.render();
    },

    setEnabled : function(enabled) {
      this.options.disabled = !enabled;
      this._textField.setEnabled(enabled);
    },

    _collectTimes : function() {
      var collection = [];
      var d = moment().sod();
      var day = d.date();

      while(d.date() === day) {
        collection.push({
          label : d.format(this.options.format),
          value : new Date(d)
        });

        d.add('minutes', this.options.interval);
      }

      return collection;
    },

    _showMenu : function() {
      $(this._menu.el).alignTo(this._textField.el, 'bottom -left', 0, 2);
      $(this._menu.el).show();
      this._menu.scrollToSelectedItem();
    },

    _hideMenu : function() {
      $(this._menu.el).hide();
    },

    _onSelectTimeItem : function(item) {
      this._hideMenu();
      this._selectedTime = item.value;
      this._textField.setValue(moment(this._selectedTime).format(this.options.format));
      this._timeEdited();
    },

    _timeEdited : function(e) {
      var newDate = moment(this._textField.getValue(), this.options.format);

      // if the enter key was pressed or we've invoked this method manually, 
      // we hide the calendar and re-format our date
      if(!e || e.keyCode === Backbone.UI.KEYS.KEY_RETURN) {
        var newValue = moment(newDate).format(this.options.format);
        this._textField.setValue(newValue);
        this._hideMenu();

        // update our bound model (but only the date portion)
        if(!!this.model && this.options.content) {
          var boundDate = this.resolveContent();
          var updatedDate = new Date(boundDate);
          updatedDate.setHours(newDate.hours());
          updatedDate.setMinutes(newDate.minutes());
          _(this.model).setProperty(this.options.content, updatedDate);
        }

        if(_(this.options.onChange).isFunction()) {
          this.options.onChange(newValue);
        }
      }
    }
  });
}());
