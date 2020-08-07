
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email('new'));
  document.querySelector('#reply_btn').addEventListener('click', () => compose_email('reply'));
  document.querySelector('#forward_btn').addEventListener('click',() => compose_email('forward'));
  document.querySelector('#compose-form').onsubmit = send;
  document.querySelector('#compose_cancel').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#refresh').addEventListener('click', refresh);
  document.querySelector('#back').addEventListener('click', refresh);

  document.querySelector('#mark-archive').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-archive').dataset.mail_id;

    function fun(mail_id, callback) {
      mark_archive(mail_id);
      callback(mail_id);
    };
    fun(mail_id, show_mail);

  });
  document.querySelector('#mark-unarchive').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-unarchive').dataset.mail_id;

    function fun(mail_id, callback) {
      mark_unarchive(mail_id);
      callback(mail_id);
    };
    fun(mail_id, show_mail);

  });
  document.querySelector('#mark-read').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-read').dataset.mail_id;

    function fun(mail_id, callback) {
      mark_read(mail_id);
      callback(mail_id);
    }
    fun(mail_id, show_mail);
  });
  document.querySelector('#mark-unread').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-unread').dataset.mail_id;

    function fun(mail_id, callback) {
      mark_unread(mail_id);
      callback();
    };
    fun(mail_id, refresh);

  });


  // By default, load the inbox
  load_mailbox('inbox');
});


function refresh() {
  setTimeout(() => {
    let refresh_item = document.querySelector('.active').innerHTML;
    load_mailbox(refresh_item.toLowerCase());
  }, 80);
}

function mark_archive(id) {
  fetch('/emails/' + parseInt(id), {
    method:'PUT',
    body: JSON.stringify({
      archived: true
    })
  });
}

function mark_unarchive(id) {
  fetch('/emails/' + parseInt(id), {
    method:'PUT',
    body: JSON.stringify({
      archived: false
    })
  });
}

function mark_read(id) {
  fetch('/emails/' + parseInt(id), {
    method:'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}

function mark_unread(id) {
  fetch('/emails/' + parseInt(id), {
    method:'PUT',
    body: JSON.stringify({
      read: false
    })
  });
}

function compose_email(purpose) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  if (purpose === 'new') {
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }
  else if(purpose === 'reply') {
    let mail_id = document.querySelector('#reply_btn').dataset.id;
    fetch('/emails/' + parseInt(mail_id))
    .then(response => response.json())
    .then(email => {
      // Prepopulate composition fields
      document.querySelector('#compose-recipients').value = email.sender;
      if (email.subject.substring(0,4).includes('Re:')) {
        document.querySelector('#compose-subject').value = email.subject;
      }
      else {
        document.querySelector('#compose-subject').value = 'Re: '+email.subject;
      }
      document.querySelector('#compose-body').value = `Write your reply here.\n\n\n\nOn ${email.timestamp} ${email.sender_name} (${email.sender}) wrote:\n\n${email.body}`;
    });
  }
  else if(purpose === 'forward') {
    let mail_id = document.querySelector('#forward_btn').dataset.id;
    fetch('/emails/' + parseInt(mail_id))
    .then(response => response.json())
    .then(email => {
      //Prepopulate composition fields
      document.querySelector('#compose-recipients').value = '';
      if (email.subject.substring(0,5).includes('Fwd:')) {
        document.querySelector('#compose-subject').value = email.subject;
      }
      else {
        document.querySelector('#compose-subject').value = 'Fwd: '+email.subject;
      }
      document.querySelector('#compose-body').value = `\n---------- Forwarded message ----------\nFrom: ${email.sender_name} (${email.sender})\nDate: ${email.timestamp}\nSunject: ${email.subject}\nTo: ${email.recipients}\n\n${email.body}`;
    });
  }

  document.querySelector('.main-top').style.display = 'none';
  if (document.querySelector('.active')) {
    document.querySelector('.active').className = '';
  }
}

function load_mailbox(mailbox) {

  setTimeout(() => {
    document.querySelector("#emails-view").innerHTML = '';
  
    document.querySelector('.main-top').style.display = 'block';
    document.querySelector('#back').style.display = 'none';
    document.querySelector('#refresh').style.display = 'inline';
    document.querySelector('#mark-archive').style.display = 'none';
    document.querySelector('#mark-unarchive').style.display = 'none';
    document.querySelector('#mark-read').style.display = 'none';
    document.querySelector('#mark-unread').style.display = 'none';

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        let list_item = document.createElement('div');
        list_item.setAttribute('class', 'list_email');
        list_item.setAttribute('data-id', email.id);
        list_item.setAttribute('onclick', `show_mail(${email.id})`);
        if (email.read == true)
          {
            list_item.style.backgroundColor = '#f5f7f7';
          }
        list_item.innerHTML =
          `<div class='list_name'>${email.sender_name}</div>
          <div class='list_subject'>${text_truncate(email.subject, 65, 'heading')}<span id='grey'>${text_truncate(email.body, 65-(text_truncate(email.subject, 65, 'heading').length), 'body')}</span></div>
          <div class='list_time'>${email.timestamp}</div>`;
        document.querySelector("#emails-view").append(list_item);
      });
    });
    
    if (document.querySelector('.active')){
      document.querySelector('.active').className = '';
    }
    document.querySelector(`#${mailbox}`).className += 'active';
  }, 80);

}

function text_truncate(str, length, type) {
  if (str.length > length) {
    let Str = str.substring(0, length - 3) + '...';
    if (type === 'heading')
      {return Str;}
    else if(type === 'body')
      {
        if (length < 4)
          {
            return ' - '.substring(0,length);
          }
        return ' - '+Str;
      }
  }
  if (type === 'heading')
    {return str;}
  else if(type === 'body')
    {return ' - '+str;}
}

function show_mail(mail_id) {

  mark_read(mail_id);

  setTimeout(() => {
    document.querySelector('.main-top').style.display = 'block';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';
    document.querySelector('#back').style.display = 'inline';
    document.querySelector('#refresh').style.display = 'none';
    document.querySelector("#mark-unread").style.display = 'inline';
    document.querySelector('#mark-read').style.display = 'none';
  
    fetch('/emails/' + parseInt(mail_id))
    .then(response => response.json())
    .then(email => {
      document.querySelector('#email-subject').innerHTML = email.subject;
      document.querySelector('#email-sender-name').innerHTML = email.sender_name;
      document.querySelector('#email-sender-address').innerHTML = '('+email.sender+')';
      document.querySelector('#email-receiver').innerHTML = 'To: '+email.recipients;
      document.querySelector('#email-time').innerHTML = email.timestamp;
      document.querySelector('#email-body').innerText = email.body;
      if (true) {                               //////////  email.sender !== my_email  //////////
        if (email.archived === true)
        {
          document.querySelector("#mark-unarchive").style.display = 'inline';
          document.querySelector('#mark-archive').style.display = 'none';
        }
      else
        {
          document.querySelector('#mark-unarchive').style.display = 'none';
          document.querySelector('#mark-archive').style.display = 'inline';
        }
      if (email.read === true)
        {
          document.querySelector('#mark-read').style.display = 'none';
          document.querySelector('#mark-unread').style.display = 'inline';
        }
      else
        {
          document.querySelector('#mark-unread').style.display = 'none';
          document.querySelector('#mark-read').style.display = 'inline';
        }
      }
      document.querySelector("#mark-archive").setAttribute('data-mail_id', email.id);
      document.querySelector("#mark-unarchive").setAttribute('data-mail_id', email.id);
      document.querySelector('#mark-read').setAttribute('data-mail_id', email.id);
      document.querySelector('#mark-unread').setAttribute('data-mail_id', email.id);
      document.querySelector('#reply_btn').setAttribute('data-id', email.id);
      document.querySelector('#forward_btn').setAttribute('data-id', email.id);
    });  
  }, 80);

}

function send() {
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;
  fetch("/emails", {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    load_mailbox('sent');
  });
  return false;
}