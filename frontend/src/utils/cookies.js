/**
 * Sets a cookie with a given name, value, and expiration in days.
 * @param {string} name 
 * @param {any} value 
 * @param {number} days 
 */
export const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  const serializedValue = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${name}=${serializedValue};${expires};path=/;SameSite=Lax`;
};

/**
 * Retrieves a cookie by name and parses it.
 * @param {string} name 
 * @returns {any} Parsed value or null if not found
 */
export const getCookie = (name) => {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      const value = cookie.substring(cookieName.length, cookie.length);
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error("Error parsing cookie:", e);
        return null;
      }
    }
  }
  return null;
};

/**
 * Removes a cookie by name.
 * @param {string} name 
 */
export const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
