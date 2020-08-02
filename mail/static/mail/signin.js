document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('input[type="button"]').onclick = () => {
        let check = true;
        if (document.querySelector('input[name="email"]').value.length === 0)
            {document.querySelector('#email_msg').innerHTML = "Enter an email address";check=false;}
        else
            {document.querySelector('#email_msg').innerHTML = "";}

        if (document.querySelector('input[name="password"]').value.length === 0)
            {document.querySelector('#pwd_msg').innerHTML = "Enter a password";check=false;}
        else
            {document.querySelector('#pwd_msg').innerHTML = "";}

        if (!check)
            {return false;}
        document.querySelector('form').submit();
    };
});