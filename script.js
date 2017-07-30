// Author: Iraj Jelodari

/*
 How to use?

open a web console (Ctrl + Shift + k) on the edx page including video in firefox, copy/paste the script in the console after hitting Enter, a green download link to fetch video subtitle appears in bottom of the page.
*/

var make_file = function (data) {
  var blob = new window.Blob([conver_to_srt(data)], {type : 'text'});
  return blob;
}

var make_download_link = function(file) {
  var previous_subtitle_link = document.querySelector('.subtitle-download-link')
  if (previous_subtitle_link != null) {
    previous_subtitle_link.remove()
  }
  var video_div = document.querySelector(".xmodule_VideoModule")
  if (video_div == null){
    alert('Video not found in this page.');
    return;
  }
  var video_name = video_div.children[0].textContent;
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(file);
  a.download = video_name+'.srt';
  a.textContent= 'Download ('+video_name+')';
  a.className = 'subtitle-download-link';
  a.style = 'color: red; font-weight:700; font-size:36px; color: #094113; background: #17ba51; padding: 20px; border-radius: 6px; position: fixed; right: 10px; bottom: 20px; z-index:1000;';
  document.body.appendChild(a);
}

var conver_to_srt = function(data) {
  var data = JSON.parse(data);
  var subtitle = '';
  for ( var i in data.text){
    subtitle += i+'\n' + conv_time(data.start[i]) + ' --> ' + conv_time(data.end[i]) + '\n' + data.text[i] + '\n\n';
  }
  return subtitle;
}

var normalize_micro_seconds = function(num) {
  if (num < 100 && num > 9) return '0'+num;
  if (num < 10) return '00'+num;
  return num;
}

var normalize_seconds_mintues_hours = function(num) {
  if (num < 10) return '0'+num;
  return num;
}

var conv_time = function(num){
    // num is a micro second 
    var microSeconds = normalize_micro_seconds(num % 1000);
    var total_seconds = normalize_seconds_mintues_hours(Math.floor(num/1000));

    var seconds = total_seconds % 60;
    var total_minutes = normalize_seconds_mintues_hours(Math.floor(total_seconds/60));

    var minutes = total_minutes % 60;
    var hours = normalize_seconds_mintues_hours(Math.floor(total_minutes/60));
  
    return hours + ':' + minutes + ':' + seconds + ',' + microSeconds;
}

var main = function (){
  var video_div = document.querySelector('.video');
  var meta_data = JSON.parse(video_div.dataset.metadata);
  var transcriptUrl = meta_data.transcriptTranslationUrl.replace('__lang__', meta_data.transcriptLanguage);
  var url = 'https://courses.edx.org/'+transcriptUrl;

  var xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      var subtitles_file = make_file(xhr.responseText);
      make_download_link(subtitles_file);
    }
  }
  xhr.open('GET', url, true);
  xhr.send();
}

main();
