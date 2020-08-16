/* eslint-disable */
function login() {
  const credentials = {
    login: document.getElementById('login').value,
    password: document.getElementById('password').value,
  };
  ajax('/auth/login', credentials, (res, headers) => {
    if (headers && headers.get('Authorization')) {
      const accessToken = res.headers.get('Authorization').split(' ')[1];
      localStorage.setItem('accessToken', accessToken);
      res.json().then((data) => localStorage.setItem('user_id', data.user_id));
      window.location.replace('/blog/articles');
    }
    return;
  });
}
