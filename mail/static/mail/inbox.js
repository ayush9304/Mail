document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send;


  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelectorAll('.list_email').forEach(email => {
    let mail_id = email.dataset.id;
    email.onclick = () => {
      document.querySelector('.main-top').style.display = 'block';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'block';
      fetch(`/emails/${mail_id}`, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(email => {
        document.querySelector('#email-view').innerHTML = `<h4>${email.subject}</h4>`;
      });
    };
  });
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
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

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
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
      list_item.innerHTML =
        `<div class='list_name'>${email.sender_name}</div>
        <div class='list_subject'>${email.subject}</div>
        <div class='list_time'>${email.timestamp}</div>`;
      document.querySelector("#emails-view").append(list_item);
    });
  });
  
  document.querySelector('.active').className = '';
  document.querySelector(`#${mailbox}`).className += 'active';

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
  });
  load_mailbox('inbox');
  return false;
}

//function show_mail(mail_id) {
//  document.querySelector('.main-top').style.display = 'block';
//  document.querySelector('#emails-view').style.display = 'none';
//  document.querySelector('#compose-view').style.display = 'none';
//  document.querySelector('#email-view').style.display = 'block';
//  fetch(`/emails/${mail_id}`, {
//    method: 'GET'
//  })
//  .then(response => response.json())
//  .then(email => {
//    document.querySelector('#email-view').innerHTML = `<h4>${email.heading}</h4>`;
//  });
//}