/**
 * Utility to detect if the site is being viewed inside an in-app browser 
 * like Instagram or Facebook, which often restricts features like Google Login.
 */
export const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInstagram = ua.indexOf('Instagram') > -1;
    const isFacebook = (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    
    return isInstagram || isFacebook;
};
