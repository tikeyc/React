export function getCookie(key) {
  const { cookie } = document;
  if (cookie) {
    const user = cookie.split(';').map(c => c.trim()).find(c => c.includes(`${key}=`));
    if (user) {
      return JSON.parse(decodeURIComponent(user.split('=')[1]));
    }
  }
  return {};
}

export function getToken() {
  const { token } = getCookie('user');
  if (token) {
    return encodeURIComponent(token);
  }
  return '';
}
