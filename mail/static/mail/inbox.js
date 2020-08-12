
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
  document.querySelector('.closebtn').onclick = close_box;




  document.querySelector('#mark-archive').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-archive').dataset.mail_id;

    if(mail_id === 'multiple')
      {list_archive();}
    else {
      function fun(mail_id, callback) {
        mark_archive(mail_id);
        callback(mail_id);
      };
      fun(mail_id, show_mail);
      setTimeout(alert('Email archived.'), 100);
    }
  });

  document.querySelector('#mark-unarchive').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-unarchive').dataset.mail_id;

    if(mail_id === 'multiple')
      {list_unarchive();}
    else {
      function fun(mail_id, callback) {
        mark_unarchive(mail_id);
        callback(mail_id);
      };
      fun(mail_id, show_mail);
      setTimeout(alert('Email moved to Inbox.'), 100);
    }
  });

  document.querySelector('#mark-read').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-read').dataset.mail_id;

    if(mail_id === 'multiple')
      {list_read();}
    else {
      function fun(mail_id, callback) {
        mark_read(mail_id);
        callback(mail_id);
      }
      fun(mail_id, show_mail);
      setTimeout(alert('Email marked as read.'), 100);
    }
  });

  document.querySelector('#mark-unread').addEventListener('click', () => {
    let mail_id = document.querySelector('#mark-unread').dataset.mail_id;

    if(mail_id === 'multiple')
      {list_unread();}
    else {
      function fun(mail_id, callback) {
        mark_unread(mail_id);
        callback();
      };
      fun(mail_id, refresh);
      setTimeout(alert('Email marked as unread.'), 100);
    }
  });


  // By default, load the inbox
  load_mailbox('inbox');

});


function list_read() {
  let check_boxes = document.querySelectorAll('.checkbox:checked');
  check_boxes.forEach(function(checkbox) {
    let mail_id = checkbox.value;
    mark_read(mail_id);
    checkbox.parentElement.parentElement.style.backgroundColor = '#f5f7f7';
  });
  setTimeout(alert(`${check_boxes.length} email(s) marked as read.`), 350);
}

function list_unread() {
  let check_boxes = document.querySelectorAll('.checkbox:checked');
  check_boxes.forEach(function(checkbox) {
    let mail_id = checkbox.value;
    mark_unread(mail_id);
    checkbox.parentElement.parentElement.style.backgroundColor = '#ffffff';
  });
  setTimeout(alert(`${check_boxes.length} email(s) marked as unread.`), 350);
}

function list_archive() {
  let check_boxes = document.querySelectorAll('.checkbox:checked');
  check_boxes.forEach(function(checkbox) {
    let mail_id = checkbox.value;
    mark_archive(mail_id);
  });
  setTimeout(alert(`${check_boxes.length} email(s) archived.`), 350);
  setTimeout(refresh(), 80);
}

function list_unarchive() {
  let check_boxes = document.querySelectorAll('.checkbox:checked');
  check_boxes.forEach(function(checkbox) {
    let mail_id = checkbox.value;
    mark_unarchive(mail_id);
  });
  setTimeout(alert(`${check_boxes.length} email(s) moved to inbox.`), 350);
  setTimeout(refresh(), 80);
}


function check_fun() {

  document.querySelector('#mark-read').setAttribute('class', 'list-read');
  document.querySelector('#mark-unread').setAttribute('class', 'list-unread');
  document.querySelector('#mark-archive').setAttribute('class', 'list-archive');
  document.querySelector('#mark-unarchive').setAttribute('class', 'list-unarchive');

  document.querySelector('#mark-read').style.display = 'inline';
  document.querySelector('#mark-unread').style.display = 'inline';
  let mailbox = document.querySelector('.active').querySelector('.box_name').innerHTML.toLowerCase();
  if(mailbox == 'inbox') {
    document.querySelector('#mark-archive').style.display = 'inline';
    document.querySelector('#mark-unarchive').style.display = 'none';
  }
  else if(mailbox == 'sent') {
    document.querySelector('#mark-archive').style.display = 'none';
    document.querySelector('#mark-unarchive').style.display = 'none';
  }
  else if(mailbox == 'archive') {
    document.querySelector('#mark-archive').style.display = 'none';
    document.querySelector('#mark-unarchive').style.display = 'inline';
  }
}

function select() {
  let checkbox = document.querySelector('#all_check');

  document.querySelector("#mark-archive").setAttribute('data-mail_id', 'multiple');
  document.querySelector("#mark-unarchive").setAttribute('data-mail_id', 'multiple');
  document.querySelector('#mark-read').setAttribute('data-mail_id', 'multiple');
  document.querySelector('#mark-unread').setAttribute('data-mail_id', 'multiple');

  checkbox.addEventListener('click', () => {
    if (checkbox.checked) {
      document.querySelectorAll('.checkbox').forEach(function(check) {
        check.checked = true;
      });
      check_fun();
    }
    else {
      document.querySelectorAll('.checkbox').forEach(function(check) {
        check.checked = false;
      });
      document.querySelector('#mark-read').style.display = 'none';
      document.querySelector('#mark-unread').style.display = 'none';
      document.querySelector('#mark-archive').style.display = 'none';
      document.querySelector('#mark-unarchive').style.display = 'none';
    }
  });
}

function each_select() {
  document.querySelectorAll('.checkbox').forEach(function(check) {
    check.addEventListener('click', () => {
      if (check.checked)
        {check_fun();}
      else if (document.querySelectorAll('.checkbox:checked').length > 0)
        {check_fun();}
      else {
        document.querySelector('#mark-read').style.display = 'none';
        document.querySelector('#mark-unread').style.display = 'none';
        document.querySelector('#mark-archive').style.display = 'none';
        document.querySelector('#mark-unarchive').style.display = 'none';
      }
    });
  });
}


function refresh() {
  setTimeout(() => {
    let refresh_item = document.querySelector('.active').querySelector('.box_name').innerHTML;
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
    document.querySelector('#all_check').style.display = 'inline';

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
          display(email);
        });
    });
    
    if (document.querySelector('.active')){
      document.querySelector('.active').className = '';
    }
    document.querySelector(`#${mailbox}`).className += 'active';
  }, 100);
  setTimeout(function() {
    document.querySelector('#all_check').checked = false;
    select();
    each_select();
  }, 400);

}

function display(email) {
  let parent_list_email = document.createElement('div');
  parent_list_email.setAttribute('class', 'parent_list_email');
  parent_list_email.setAttribute('id', email.id);
  let list_item0 = document.createElement('div');
  list_item0.setAttribute('class', 'select-box');
  list_item0.innerHTML = `<input type='checkbox' class='checkbox' name='checkbox' value=${email.id}>`;
  parent_list_email.appendChild(list_item0);
  let list_item = document.createElement('div');
  list_item.setAttribute('class', 'list_email');
  list_item.setAttribute('data-id', email.id);
  list_item.setAttribute('onclick', `show_mail(${email.id})`);
  parent_list_email.appendChild(list_item);
  if (email.read == true)
    {parent_list_email.style.backgroundColor = '#f5f7f7';}
  else 
    {parent_list_email.style.backgroundColor = 'white';}
  list_item.innerHTML =
    `<div class='list_name'>${email.sender_name}</div>
    <div class='list_subject'>${text_truncate(email.subject, 65, 'heading')}<span id='grey'>${text_truncate(email.body, 65-(text_truncate(email.subject, 65, 'heading').length), 'body')}</span></div>
    <div class='list_time'>${email.timestamp}</div>`;
  document.querySelector("#emails-view").append(parent_list_email);
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
    document.querySelector('#all_check').style.display = 'none';
  
    fetch('/emails/' + parseInt(mail_id))
    .then(response => response.json())
    .then(email => {
      document.querySelector('#email-subject').innerHTML = email.subject;
      document.querySelector('#email-sender-name').innerHTML = email.sender_name;
      document.querySelector('#email-sender-address').innerText = `<${email.sender}>`;
      document.querySelector('#email-receiver').innerHTML = 'To: '+email.recipients;
      document.querySelector('#email-time').innerHTML = email.timestamp;
      document.querySelector('#email-body').innerText = email.body;

      if (email.archived === true) {
        document.querySelector("#mark-unarchive").style.display = 'inline';
        document.querySelector('#mark-archive').style.display = 'none';
      }
      else {
        document.querySelector('#mark-unarchive').style.display = 'none';
        document.querySelector('#mark-archive').style.display = 'inline';
      }
      if (email.read === true) {
        document.querySelector('#mark-read').style.display = 'none';
        document.querySelector('#mark-unread').style.display = 'inline';
      }
      else {
        document.querySelector('#mark-unread').style.display = 'none';
        document.querySelector('#mark-read').style.display = 'inline';
      }

      if (document.querySelector('.active').querySelector('.box_name').innerHTML === 'Sent') {
        document.querySelector('#mark-unarchive').style.display = 'none';
        document.querySelector('#mark-archive').style.display = 'none';
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
    if(result.error) {
      setTimeout(() => {
        alert(result.error);
        compose_email('new');
        document.querySelector('#compose-recipients').value = recipients;
        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = body;
      },200);
      return false;
    }
    load_mailbox('sent');
    setTimeout(alert('Email sent.'), 200);
  });
  return false;
}

function close_box() {
  let close = document.querySelector(".closebtn");

  let div = close.parentElement;
  div.style.opacity = "0";
  setTimeout(function(){ div.style.display = "none"; }, 600);
}

function alert(message) {
  document.querySelector('.message').innerHTML = message;
  let div = document.querySelector('.alert');
  div.style.opacity = "1";
  div.style.display = 'block';
  setTimeout(() => {
    if (div.style.display === 'block') {
      close_box();
    }
  }, 4000);
}