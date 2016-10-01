const SONG_NUM_PER_VIEW = 5;
const INIT_SONG_VIEW_NUM = 4;

$(function() {
  $(".button-collapse").sideNav();

  $('#reload_btn').on('click', function() {
    location.reload();
  });
  $('#select_query_btn').on('click', function() {
    search_song();
  });
  $('#song_text').on('input propertychange', function() {
    $('#chars').text($(this).val().length);
  });
  $('#clear_search_cond_btn').on('click', function() {
    confirm_clear_inside('#search_cond', 'input, textarea');
  });
  $('#save_btn').on('click', function() {
    save_song();
  });
  $('#clear_written_song_btn').on('click', function() {
    confirm_clear_inside('#written_song', 'input, textarea');
  });
  $('#add_song_view_btn').on('click', function() {
    add_song_view();
  });
  $(window).scroll(function() {
    scroll_fire();
  });

  // Materialize.css
  $('.modal-trigger').leanModal();
  $('.datepicker').pickadate({
    selectMonths: true,
    format: 'yyyy-mm-dd',
  });

  // initialize page
  for (var i = 0; i < INIT_SONG_VIEW_NUM; i++) {
    show_song(get_fluct_num(SONG_NUM_PER_VIEW, 2));
  }
});

function confirm_clear_inside(elm_selector, target_selector) {
  Materialize.toast('<span>Clear?</span><a class="btn-flat yellow-text" onclick="clear_inside(\'' + elm_selector + '\', \'' + target_selector + '\');">Continue</a>', 3000)
}

function clear_inside(elm_selector, target_selector) {
  $(elm_selector).find(target_selector).each(function() {
    if ($(this).val()) {
      $(this).val('');
    }
    if ($(this).text()) {
      $(this).text('');
    }
  });
}

function scroll_fire() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    add_song_view();
  }
}

function search_song() {
  var song_text_cond = $('#song_text_cond').val();
  var name_cond = $('#name_cond').val();
  var created_at_from_cond = $('#created_at_from_cond').val();
  var created_at_to_cond = $('#created_at_to_cond').val();
  var description_cond = $('#description_cond').val();

  if (!song_text_cond && !name_cond && !created_at_from_cond && !created_at_to_cond && !description_cond) {
    Materialize.toast('You need to enter any condition.', 3000);
    return false;
  }

  if (created_at_to_cond < created_at_from_cond) {
    $('#created_at_from_cond').val(created_at_to_cond);
    $('#created_at_to_cond').val(created_at_from_cond);
    created_at_from_cond = $('#created_at_from_cond').val();
    created_at_to_cond = $('#created_at_to_cond').val();
  }

  var processor = ('#search_view > .modal-footer');
  start_process(processor)
  $.ajax({
    url: '/api/search_song',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      song_text: song_text_cond,
      name: name_cond,
      created_at_from: created_at_from_cond,
      created_at_to: created_at_to_cond,
      description: description_cond,
    }
  }).done(function(data, textStatus, xhr) {
    if ($(data).length == 0) {
      Materialize.toast('No hits.', 3000);
      return false;
    }
    $('#song_view_container').empty();
    draw_song_view(data, get_fluct_num(SONG_NUM_PER_VIEW, 2), true);
// TODO    $('#song_view_container').prepend('<section><h5>Search Result</h5>song_text like ' + song_text_cond + ', name like ' + name_cond + ', created_at >= ' + created_at_from_cond + ', created_at <= ' + created_at_to_cond + ', description like ' + description_cond + '</section>');
    $('#song_view_container').scrollTop(0);
    $('#search_view').closeModal();
    clear_inside('#search_cond', 'input, textarea');
    $('#search_cond').scrollTop(0);
  }).fail(function(xhr, textStatus, errorThrown) {
    switch (xhr.status) {
      case 901: Materialize.toast('Too many hits.', 3000); break;
      default: Materialize.toast('error...' + xhr.status + ':<pre>' + xhr.responseText + '</pre>', 5000);
    }
  }).always(function() {
    end_process(processor);
  });
}

function start_process(selector) {
  $(selector).find('a, button').addClass('hide');
  $(selector).find('.processing').removeClass('hide');
}

function end_process(selector) {
  $(selector).find('a, button').removeClass('hide');
  $(selector).find('.processing').addClass('hide');
}

function add_song_view() {
  start_process('#song_view_footer');
  $(document).delay(2000).queue(function() {
    show_song(get_fluct_num(SONG_NUM_PER_VIEW, 2));
    $(this).dequeue();
  });
}

function show_song(song_num) {
  $.ajax({
    url: '/api/get_song',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      song_num: song_num,
    }
  }).done(function(data, textStatus) {
    draw_song_view(data, song_num, false);
  }).fail(function(xhr, textStatus, errorThrown) {
    Materialize.toast('error...' + xhr.status + ':<pre>' + xhr.responseText + '</pre>', 5000);
  }).always(function() {
    end_process('#song_view_footer');
  });
}

function draw_song_view(data, song_num, requires_accent) {
  // TODO add song_view_no + get max song_view_no's li length + if the length less than ..
  var song_view;
  var header_color_class = requires_accent ? 'yellow accent-3' : 'brown darken-2 white-text';
  $.each(data, function(index, value) {
    if (index % song_num == 0) {
      if (song_view) {
        $('#song_view_container').append(get_img_cut());
	$('#song_view_container').append(song_view);
        song_view.find('.collapsible').collapsible();
      }
      song_view = $('<div class="song_view col 12s"><ul class="collapsible popout"></ul></div>');
    }
    song_view.children('ul').append('<li><div class="collapsible-header ' + header_color_class + '"><span class="truncate">' + this['song_text'] + '</span></div><div class="collapsible-body"><ul class="collection"><li class="collection-item avatar"><i class="material-icons circle">album</i><span class="title word-wrap">' + this['song_text'] + '</span><p><span class="right">' + this['created_at'] + '</span><br><span class="right">' + this['name'] + '</span>' + (this['description'] ? '<br><br><span class="word-wrap">' + this['description'] + '</span>' : '') + '</p></li></ul></div><input type="hidden" value="' + this['song_id'] + '"></input></li>');
  });
  if (song_view && 0 < song_view.find('li').length) {
    $('#song_view_container').append(get_img_cut());
    $('#song_view_container').append(song_view);
    song_view.find('.collapsible').collapsible({
      accordion : false
    });
  }
}

function get_fluct_num(org_num, range_num) {
  var random = Math.random();
  var sign = (Math.round(random) == 0) ? 1 : -1;
  var ret = org_num + sign * Math.round(random * range_num);
  return ret;
}

function get_img_cut() {
  var s_offset = Math.round(Math.random() * 4);
  var m_offset = Math.round(Math.random() * 6);
  var l_offset = Math.round(Math.random() * 8);
  var circle = Math.round(Math.random() * 2) == 2 ? 'circle' : '';
  var img_src = 'www/img/img_cut/' + ("000" + Math.floor(Math.random() * 462)).substr(-4) + '.jpg';
  var ret = '<div class="row"><div class="col s8 offset-s' + s_offset + ' m6 offset-m' + m_offset + ' l4 offset-l' + l_offset + '"><img class="responsive-img ' + circle + '" src="' + img_src + '"></img></div></div>';
  return ret;
}

function save_song() {
  var song_text = $('#song_text').val();
  if (!song_text.trim()) {
    Materialize.toast('You need to write a song!', 3000);
    return false;
  }
  var name = $('#name').val();
  if (!name.trim()) {
    name = $('#name').attr("placeholder");
  }
  var processor = '#write_view > .modal-footer';
  start_process(processor);
  $.ajax({
    url: '/api/save_song',
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      song_text: song_text,
      name: name,
      description: $('#description').val(),
    }
  }).done(function(data, textStatus) {
    Materialize.toast('Saved.', 5000, 'rounded');
    $('#write_view').closeModal();
    // TODO $('#songs_list').append('<li>' + $('#song_text').val() + ' by ' + $('#name').val() +'</li>');
    clear_inside('#write_view', 'input, textarea, #chars');
    $('#write_view').scrollTop(0);
  }).fail(function(xhr, textStatus, errorThrown) {
    switch (xhr.status) {
      case 911: Materialize.toast('The song already exists.', 3000); break;
      default: Materialize.toast('error...' + xhr.status + ':<pre>' + xhr.responseText + '</pre>', 5000);
    }
  }).always(function() {
    end_process(processor);
  });
}
