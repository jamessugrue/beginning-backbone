


<script type="text/x-handlebars-template" id="profile-template">
 <div class='tiles clearfix'>
    <div class="tile double bg-color-orangeDark">
      <div class="tile-content">
          <img src="{{user.profile_image_url}}" class="place-left">
          <h3 style="margin-bottom: 5px;">{{user.name}}</h3>
          <p>{{user.description}}</p>
          <div class="brand">
              <div class="badge">{{user.followers_count}} Followers</div>
          </div>
      </div>
    </div>
  </div>
</script>


<script type="text/x-handlebars-template" id="timeline-template">
 <ul class='listview fluid'>
        {{#each tweet}}
      <li>
          <div class='icon'>
              <img src='{{user.profile_image_url}}'></img>
        </div>
            <div class='data'>
                <h4>{{user.name}}</h4>
                
                <p>{{format text}}</p>
                <p class="timestamp"><i>{{friendlyDate}}</i></p>
            </div>
        </li>
        {{/each}}
    </ul>
 </script>