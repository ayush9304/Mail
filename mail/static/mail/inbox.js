document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send;
  document.querySelector('#refresh').addEventListener('click', refresh);
  document.querySelector('#mark-archive').addEventListener('click', mark_archive);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('.main-top').style.display = 'none';
  document.querySelector('.active').className = '';
}

function load_mailbox(mailbox) {
  
  document.querySelector('.main-top').style.display = 'block';
  document.querySelector('#refresh').style.display = 'inline';

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
      list_item.innerHTML =
        `<div class='list_name'>${email.sender_name}</div>
        <div class='list_subject'>${email.subject}</div>
        <div class='list_time'>${email.timestamp}</div>`;
      document.querySelector("#emails-view").append(list_item);
    });
  });
  
  if (document.querySelector('.active')){
    document.querySelector('.active').className = '';
  }
  document.querySelector(`#${mailbox}`).className += 'active';

}

function send() {
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;
  fetch("/emails", {
    method: 'POST',
    body: JSON.parse({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
  });
  load_mailbox('inbox');
  return false;
}

function show_mail(mail_id) {
  document.querySelector('.main-top').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#refresh').style.display = 'none';

  fetch('/emails/' + parseInt(mail_id))
  .then(response => response.json())
  .then(email => {
    document.querySelector('#email-subject').innerHTML = email.subject;
    document.querySelector('#email-sender-name').innerHTML = email.sender_name;
    document.querySelector('#email-sender-address').innerHTML = '('+email.sender+')';
    document.querySelector('#email-receiver').innerHTML = 'To: '+email.recipients;
    document.querySelector('#email-time').innerHTML = email.timestamp;
    document.querySelector('#email-body').innerText = email.body;
    if (email.archived === True)
      {
        document.querySelector("#mark-unarchive").style.display = 'inline';
        document.querySelector('#mark-archive').style.display = 'none';
      }
    else
      {
        document.querySelector('#mark-unarchive').style.display = 'none';
        document.querySelector('#mark-archive').style.display = 'inline';
      }
    if (email.read === True)
      {
        document.querySelector("#mark-unread").style.display = 'inline';
        document.querySelector('#mark-read').style.display = 'none';
      }
    else
      {
        document.querySelector('#mark-unread').style.display = 'none';
        document.querySelector('#mark-read').style.display = 'inline';
      }
    document.querySelector("#mark-archive").setAttribute('data-mail_id', email.id);
    document.querySelector("#mark-unarchive").setAttribute('data-mail_id', email.id);
    document.querySelector('#mark-read').setAttribute('data-mail_id', email.id);
    document.querySelector('#mark-unread').setAttribute('data-mail_id', email.id);
  });
}

function refresh() {
  let refresh_item = document.querySelector('.active').innerHTML;
  load_mailbox(refresh_item.toLowerCase());
}

function mark_archive(mail_id) {
  fetch('/emails/' + parseInt(mail_id))
  .then()
}