<!DOCTYPE html>
<html>
<head> 
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="msapplication-tap-highlight" content="no">
  <meta name="description" content="Everyone is a songwriter.">
  <meta name="theme-color" content="#EE6E73">
  <title>Glorious Daisy</title>
<!--  <link rel="stylesheet" href="https://cdn.jsdelivr.net/material-design-lite/1.0.0/material.min.css" /> -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="www/css/glorious_daisy.css" />
</head>
<body class="grey darken-3">
  <header class="blue darken-2">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text">Glorious Daisy<br />(* For Traditional Song Lovers *)</h5>
          <p class="grey-text text-lighten-4">Hello. Here you can read and write any songs.<br />Let's try us : )</p>
        </div>
        <div class="col l4 offset-l2 s12">
          <h5 class="white-text">Links</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="http://lesson-japan.com/html/06haikutanka.html">Japanese Culture</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="container">
      <div id="song_view_container" class="blue lighten-5"></div>
      <div id="song_view_footer" class="center">
        <img class="responsive-img processing hide" src="www/img/processing.gif"></img>
    
      </div>
    </div>
  
    <div class="fixed-action-btn" style="top: 8px; right: 16px;">
      <a id="reload_btn" class="btn-floating btn yellow">
        <i class="material-icons grey-text text-darken-1">replay</i>
      </a>
    </div>
    
    <div class="fixed-action-btn" style="top: 56px; right: 16px;">
      <a id="search_btn" class="btn-floating btn modal-trigger blue" href="#search_view">
        <i class="material-icons">search</i>
      </a>
    </div>
    
    <div class="fixed-action-btn" style="top: 104px; right: 16px;">
      <a id="write_btn" class="btn-floating btn modal-trigger orange darken-2" href="#write_view">
        <i class="material-icons">mode_edit</i>
      </a>
    </div>

    <div id="search_view" class="modal modal-fixed-footer bottom-sheet">
      <div id="search_cond" class="modal-content">
        <div class="row">
          <div class="input-field col s12">
            <input id="song_text_cond" type="text" class="validate"></input>
            <label for="song_text_cond">Song Text</label>
          </div>
	</div>
	<div class="row">
          <div class="input-field col s4">
            <input id="name_cond" type="text" class="validate"></input>
            <label for="name_cond">Name</label>
          </div>
          <div class="input-field col s4">
            <input id="created_at_from_cond" type="date" class="datepicker center-align"></input>
            <label for="created_at_from_cond">From</label>
          </div>
          <div class="input-field col s4">
            <input id="created_at_to_cond" type="date" class="datepicker center-align"></input>
            <label for="created_at_to_cond">To</label>
          </div>
	</div>
        <div class="row">
          <div class="input-field col s12">
            <input id="description_cond" type="text" class="validate"></input>
            <label for="description_cond">Description</label>
          </div>
	</div>
        <div class="row">
          <div class="input-field col s12"></div>
          <img class="responsive-img processing hide" src="www/img/modal_processing.gif"></img>
        </div>
      </div>
      <div class="modal-footer">
        <a id="select_query_btn" class="btn waves-effect waves-light">Search</a>
        <a id="clear_search_cond_btn" class="btn waves-effect waves-light">Clear</a>
        <div class="center">
          <img class="responsive-img processing hide" src="www/img/modal_processing.gif"></img>
        </div>
      </div>
    </div>

    <div id="write_view" class="modal modal-fixed-footer bottom-sheet">
      <div id="written_song" class="modal-content">
        <div class="row">
          <div class="input-field col s12">
            <input id="song_text" type="text" class="validate" placeholder="（あなたの歌を自由に詠んでください : ) ）"></input>
            <label for="song_text">Song Text</label>
          </div>
	</div>
	<div class="row">
          <div class="input-field col s3">
            <textarea id="name" type="text" class="materialize-textarea" placeholder="詠み人知らず"></textarea>
            <label for="name">Name</label>
          </div>
          <div class="input-field col s9">
            <textarea id="description" class="materialize-textarea" placeholder="（補足説明や注釈をこちらに書き記すことができます）"></textarea>
            <label for="description">Description</label>
          </div>
	</div>
        <div class="row">
          <div class="input-field col s12"></div>
          <img class="responsive-img processing hide" src="www/img/modal_processing.gif"></img>
        </div>
      </div>
      <div class="modal-footer">
        <a id="save_btn" class="btn waves-effect waves-light">Save</a>
        <a id="clear_written_song_btn" class="btn waves-effect waves-light">Clear</a>
        <div class="center">
          <img class="responsive-img processing hide" src="www/img/modal_processing.gif"></img>
        </div>
      </div>
    </div>
  </main>

  <footer class="page-footer deep-orange darken-2">
    <div class="container">
      <div class="row center">
	<h5 class="white-text">Keep feeling.
	  <a id="add_song_view_btn" class="btn-floating btn yellow">
	    <i class="material-icons grey-text text-darken-1">trending_flat</i>
          </a>
	</h5>
	<span class="grey-text text-lighten-4">
	  Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning. (by Albert Einstein)
	</span>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container center">
        © 2015 Gernica.Nabe
      </div>
    </div>
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
  <script src="www/js/glorious_daisy.js"></script>
</body>
</html>
