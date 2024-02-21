const TOKEN = process.env.REACT_APP_CAPTCHA_SITEKEY;

function ready(action: string, and: (token: string) => void) {
  // @ts-ignore
  grecaptcha.enterprise.ready(async () => {
    // @ts-ignore
    const token = await grecaptcha.enterprise.execute(TOKEN, {action: action});
    and(token);
  });
}

export {ready}
