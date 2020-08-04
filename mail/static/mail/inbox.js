document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send;


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

  fetch('/emails/' + parseInt(mail_id))
  .then(response => response.json())
  .then(email => {
    document.querySelector('#email-subject').innerHTML = email.subject;
    document.querySelector('#email-sender-name').innerHTML = email.sender_name;
    document.querySelector('#email-sender-address').innerHTML = '('+email.sender+')';
    document.querySelector('#email-receiver').innerHTML = 'To: '+email.recipients;
    document.querySelector('#email-time').innerHTML = email.timestamp;
    document.querySelector('#email-body').innerHTML = email.body;
  });
  //let div = document.createElement('div');
  //div.setAttribute()
  //let archive = document.createElement('button');
  //archive.setAttribute('id', 'make-archive');
  //archive.setAttribute('title', 'Archive');
  //let read = document.createElement('button');
  //read.setAttribute('id', 'mark-read');
  //read.setAttribute('title', 'Mark as read');
  //let unread = document.createElement('button');
  //unread.setAttribute('id', 'mark-unread');
  //unread.setAttribute('title', 'Mark as unread');
  //archive.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-archive-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  //<path fill-rule="evenodd" d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM6 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
  //</svg>`;
  //read.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-envelope-open-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  //<path d="M8.941.435a2 2 0 0 0-1.882 0l-6 3.2A2 2 0 0 0 0 5.4v.313l6.709 3.933L8 8.928l1.291.717L16 5.715V5.4a2 2 0 0 0-1.059-1.765l-6-3.2zM16 6.873l-5.693 3.337L16 13.372v-6.5zm-.059 7.611L8 10.072.059 14.484A2 2 0 0 0 2 16h12a2 2 0 0 0 1.941-1.516zM0 13.373l5.693-3.163L0 6.873v6.5z"/>
  //</svg>`;
  //unread.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-envelope-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  //<path fill-rule="evenodd" d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
  //</svg>`;
  //div.append(archive, read, unread);
  //document.querySelector('.main-top').append(div);
}