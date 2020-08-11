document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#signup-form').onsubmit = signup;
});

function signup() {
    let check = true;
    if (document.querySelector('input[name="first_name"]').value.length === 0)
        {document.querySelector('#fname_msg').innerHTML = "Enter first name";check=false;}
    else
        {document.querySelector('#fname_msg').innerHTML = "";}

    if (document.querySelector('input[name="last_name"]').value.length === 0)
        {document.querySelector('#lname_msg').innerHTML = "Enter last name";check=false;}
    else
        {document.querySelector('#lname_msg').innerHTML = "";}

    if (document.querySelector('input[name="email"]').value.length === 0)
        {document.querySelector('#email_msg').innerHTML = "Choose an email address";check=false;}
    else
        {document.querySelector('#email_msg').innerHTML = "";}

    let pwd = document.querySelector('input[name="password"]').value;
    let c_pwd = document.querySelector('input[name="confirmation"]').value;

    if (pwd.length === 0)
        {document.querySelector('#pwd_msg').innerHTML = "Enter a password";check=false;}
    else
        {document.querySelector('#pwd_msg').innerHTML = "";}

    if (!check)
        {return false;}

    if (c_pwd.length === 0)
        {document.querySelector('#cpwd_msg').innerHTML = "Confirm your password";check=false;}
    else
        {document.querySelector('#cpwd_msg').innerHTML = "";}
    
    if (!check)
        {return false;}

    if (pwd !== c_pwd)
    {
        document.querySelector('input[name="confirmation"]').value = "";
        document.querySelector('#cpwd_msg').innerHTML = "Password must match";
        check = false;
    }
    else
        {document.querySelector('#cpwd_msg').innerHTML = "";}

    if (!check)
        {return false;}
    //document.querySelector('form').submit();
}