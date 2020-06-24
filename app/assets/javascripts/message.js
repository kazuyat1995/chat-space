$(function(){
  function buildHTML(message){
    if ( message.image ) {
      //data-idが反映されるようにしている
      var html = 
        `<div class="message" data-message-id=${message.id}>
          <div class="message__upper-info">
            <div class="message__upper-info__talker">
              ${message.user_name}
            </div>
            <div class="message__upper-info__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message__text">
            <p class="message__text__content">
              ${message.content}
            </p>
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      //同様にdata-idが反映されるようにしている
      var html =
        `<div class="message" data-message-id=${message.id}>
          <div class="message__upper-info">
            <div class="message__upper-info__talker">
              ${message.user_name}
            </div>
            <div class="message__upper-info__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message__text">
            <p class="message__text__content">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }

  $('#new_message').on('submit',function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');

    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      $('form')[0].reset();
    })
    .fail(function() {
      alert('メッセージを送信できません');
    })
    .always(function(){
      $('.submit-btn').prop('disabled', false);
    })
  });

  // 取得した投稿データを表示できるようにしよう・自動更新はこちらから
  var reloadMessages = function(){

    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得   
    var last_message_id = $('.message:last').data("message-id");
    // console.log(last_message_id);
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: "GET",
      dataType: 'json',
       //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages){
      if (messages.length !== 0) {
        // console.log('success');
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      }
    })
    .fail(function(){
      alert('error');
    });
  };
  // /\/groups\/\d+\/messages/の部分が正規表現です。正規表現は基本的には/と/で囲んだ部分になりますが、/自体も正規表現に含めたい場合、直前に\(バックスラッシュ)を付ける。
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
  //7000(7秒)ごとにreloadMessagesという関数を実行し自動更新を行う。
    setInterval(reloadMessages, 7000);
  }
});