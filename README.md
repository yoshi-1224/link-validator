# README
Chrome extension to check if all the links within the selected element are not expired.

How to use:
1. Press extension icon to enable selecting mode. 
2. Select a particular HTML element containing `<a>` tags you want to validate.
3. The extension will check if all linked pages still exist by making HTTP/HTTPS requests. Ones that do not will be striked-through.

What does it mean by **valid links**?

Links that:
- do not return 404 Not Found
- do not get redirected to the home page or another irrelevant `index.html`, `index.php` etc (most likely because of 404)
- are redirected to another domain, but the file still exists (e.g. `foo.com/page1.html` redirected to `bar.com/page1.html` is valid)


