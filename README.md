**XMediusSENDSECURE (SendSecure)** is a collaborative file exchange platform that is both highly secure and simple to use.
It is expressly designed to allow for the secured exchange of sensitive documents via virtual SafeBoxes.

SendSecure comes with a **Web API**, which is **RESTful**, uses **HTTPs** and returns **JSON**.

Specific libraries have been published for various languages:
[C#](https://github.com/xmedius/sendsecure-csharp),
[Java](https://github.com/xmedius/sendsecure-java),
**JavaScript**,
[PHP](https://github.com/xmedius/sendsecure-php),
[Python](https://github.com/xmedius/sendsecure-python)
and
[Ruby](https://github.com/xmedius/sendsecure-ruby).

# sendsecure-js

**This library allows you to use the SendSecure Web API via JavaScript (Server or Client).**

With this library, you will be able to:
* Authenticate SendSecure users
* Create new SafeBoxes

# Table of Contents

* [Installation](#installation)
* [Quick Start](#quickstart)
* [Usage](#usage)
* [License](#license)
* [Credits](#credits)

<a name="installation"></a>
# Installation

## Prerequisites

sendsecure-js is written following the EcmaScript2015 standard, which may not be fully supported by all the browsers out there.
However, to get away with this setback we're using [Rollup.js](http://rollupjs.org) and [Babel.js](https://babeljs.io/) for bundling
and transpiling the code to something runnable for the browser or node.

- Node 6.5+ OR Firefox 49+, Chrome 49+, Edge 14+
- The SendSecure service, provided by [XMedius](https://www.xmedius.com/en/products?source=sendsecure-js) (demo accounts available on demand)

## Install Package

### Via npm

```
npm install --save sendsecure-js
```

### Using Source Code

```
git clone https://github.com/xmedius/sendsecure-js.git
cd <path_to_sendsecure-js>/sendsecure-js
npm install
```

<a name="quickstart"></a>
# Quick Start

## Authentication (Retrieving API Token)

Authentication is done using an API Token, which must be first obtained based on SendSecure enterprise account and user credentials.
Here is the minimum code to get such a user-based API Token.

### Server (Node.js)

```javascript
var SendSecure = require ('../../build/sendsecure.cjs.min.js')
SendSecure.Client.getUserToken("deathstar", "darthvader", "d@Rk$1De", "DV-TIE/x1", "TIE Advanced x1", "The Force App")
  .then(function(userToken) { console.log(userToken); })
  .catch(function(error) { console.error(error); })
```

### Client (Browser)

```javascript
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <input type="file" id="input">
    <script  src="../../build/sendsecure.iife.min.js"></script>
    <script type="text/javascript">
      SendSecure.Client.getUserToken("deathstar", "darthvader", "d@Rk$1De", "DV-TIE/x1", "TIE Advanced x1", "The Force App")
        .then(function(userToken) { console.log(userToken); })
        .catch(function(error) { console.error(error); });
    </script>
  </body>
</html>
```

## SafeBox Creation (Using SafeBox Helper Class)

Here is the minimum required code to create a SafeBox – with 1 recipient, a subject, a message and 1 attachment.
This example uses the user's *default* security profile (which requires to be set in the account).

### Server (Node.js)

```javascript
var SendSecure = require ('../build/sendsecure.cjs.min.js')

var userEmail = 'darthvader@empire.com',
      token = 'USER|1d495165-4953-4457-8b5b-4fcf801e621a',
      enterpriseAccount = 'deathstar',
      endpoint = 'https://portal.xmedius.com';

var safebox = new SendSecure.Helpers.Safebox(userEmail);
safebox.subject = 'Family matters';
safebox.message = 'Son, you will find attached the evidence.';

var recipient = new SendSecure.Helpers.Recipient( { email: 'lukeskywalker@rebels.com' } );
var contactMethod = new SendSecure.Helpers.ContactMethod();
contactMethod.destinationType = 'cell_phone'
contactMethod.destination =  '555-232-5334'
recipient.contactMethods.push(contactMethod);
safebox.recipients.push(recipient);

safebox.attachments.push( new SendSecure.Helpers.Attachment("Birth_Certificate.pdf"));
var client = new  SendSecure.Client(token, enterpriseAccount, endpoint);
client.submitSafebox(safebox)
  .then( function(safeboxResponse) { console.log(safeboxResponse); })
  .catch(function(safeboxResponse) { console.error(error); } );
```

### Client (Browser)

```javascript
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <input type="file" id="input">
    <script  src="../../build/sendsecure.iife.min.js"></script>
    <script type="text/javascript">
      var inputElement = document.getElementById("input");
      inputElement.addEventListener("change", function(){
        var file = this.files[0]; /* now you can work with the file list */
        var userEmail = 'darthvader@empire.com',
              token = 'USER|1d495165-4953-4457-8b5b-4fcf801e621a',
              enterpriseAccount = 'deathstar',
              endpoint = 'https://portal.xmedius.com';
        var safebox = new SendSecure.Helpers.Safebox(userEmail);
        safebox.subject = 'Family matters';
        safebox.message = 'Son, you will find attached the evidence.';
        var recipient = new SendSecure.Helpers.Recipient( { email: 'lukeskywalker@rebels.com' } );
        var contactMethod = new SendSecure.Helpers.ContactMethod();
        contactMethod.destinationType = 'cell_phone'
        contactMethod.destination =  '555-232-5334'
        recipient.contactMethods.push(contactMethod);
        safebox.recipients.push(recipient);
        safebox.attachments.push( new SendSecure.Helpers.Attachment(file));
        var client = new  SendSecure.Client(token, enterpriseAccount, endpoint);
        client.submitSafebox(safebox)
          .then( function(safeboxResponse) { console.log(safeboxResponse); })
          .catch(function(safeboxResponse) { console.error(error); } );
      })
    </script>
  </body>
</html>
```

<a name="usage"></a>
# Usage

## Helper Methods

### Get User Token
```
getUserToken(enterpriseAccount, username, password, deviceId, deviceName, applicationType, endpoint, oneTimePassword)
```
Creates and returns an API Token for a specific user within a SendSecure enterprise account.
Calling this method again with the exact same params will always return the same Token.

Param             | Definition
------------------|-----------
enterpriseAccount | The SendSecure enterprise account
username          | The username of a SendSecure user of the current enterprise account
password          | The password of this user
deviceId          | The unique ID of the device used to get the Token
deviceName        | The name of the device used to get the Token
applicationType   | The type/name of the application used to get the Token ("sendsecure-js" will be used by default if empty)
endpoint          | The URL to the SendSecure service ("https://portal.xmedius.com" will be used by default if empty)
oneTimePassword   | The one-time password of this user (if any)

### Client Object Constructor
```
constructor(apiToken, enterpriseAccount, endpoint, locale)
```

Param             | Definition
------------------|-----------
apiToken          | The API Token to be used for authentication with the SendSecure service
enterpriseAccount | The SendSecure enterprise account
endpoint          | The URL to the SendSecure service ("https://portal.xmedius.com" will be used by default if empty)
locale            | The locale in which the server errors will be returned ("en" will be used by default if empty)

### Get Enterprise Settings
```
enterpriseSettings()
```
Returns all values/properties of the enterprise account's settings specific to SendSecure.

### Get Default Security Profile
```
defaultSecurityProfile(userEmail)
```
Returns the default security profile (if it has been set) for a specific user, with all its setting values/properties.

Param      | Definition
-----------|-----------
userEmail  | The email address of a SendSecure user of the current enterprise account

### Get Security Profiles
```
securityProfiles(userEmail)
```
Returns the list of all security profiles available to a specific user, with all their setting values/properties.

Param      | Definition
-----------|-----------
userEmail  | The email address of a SendSecure user of the current enterprise account

### Initialize SafeBox
```
initializeSafebox(safebox)
```
Pre-creates a SafeBox on the SendSecure system and returns the updated [Safebox](#safebox) object with the necessary system parameters filled out (GUID, public encryption key, upload URL).

Param      | Definition
-----------|-----------
safebox    | A [Safebox](#safebox) object to be initialized by the SendSecure system

### Upload Attachment
```
uploadAttachment(safebox, attachment)
```
Uploads the specified file as an Attachment of the specified SafeBox and returns the updated [Attachment](#attachment) object with the GUID parameter filled out.

Param      | Definition
-----------|-----------
safebox    | An initialized [Safebox](#safebox) object
attachment | An [Attachment](#attachment) object - the file to upload to the SendSecure system

### Commit SafeBox
```
commitSafebox(safebox)
```
Finalizes the creation (commit) of the SafeBox on the SendSecure system.
This actually "Sends" the SafeBox with all content and contact info previously specified.

Param      | Definition
-----------|-----------
safebox    | A [Safebox](#safebox) object already initialized, with security profile, recipient(s), subject and message already defined, and attachments already uploaded.

### Submit SafeBox
```
submitSafebox(safebox)
```
This method is a high-level combo that initializes the SafeBox, uploads all attachments and commits the SafeBox.

Param      | Definition
-----------|-----------
safebox    | A non-initialized [Safebox](#safebox) object with security profile, recipient(s), subject, message and attachments (not yet uploaded) already defined.


## Helper Modules

<a name="safebox"></a>
### Safebox

Builds an object to send all the necessary information to create a new Safebox.

Attribute            | Definition
---------------------|-----------
guid                 | The unique identifier of the SafeBox (filled by the system once the SafeBox is initialized).
uploadUrl            | The URL used to upload the SafeBox attachments (filled by the system once the SafeBox is initialized).
publicEncryptionKey  | The key used to encrypt the SafeBox attachments and/or messages (filled by the system once the SafeBox is initialized).
userEmail            | The email address of the creator of the SafeBox (mandatory).
subject              | The subject of the SafeBox (optional).
message              | The initial message of the SafeBox (optional if the SafeBox has at least one attachment).
recipients           | The list of all [Recipient](#recipient) objects of the SafeBox (mandatory, at least one recipient).
attachments          | The list of all [Attachment](#attachment) objects of the SafeBox (optional if the SafeBox has a message).
securityProfile      | The SecurityProfile object defining security options for the SafeBox (mandatory).
notificationLanguage | The language used for email notifications sent to the recipients (optional, English by default).

### SafeboxResponse

Represents the response to the successful creation of a SafeBox in the SendSecure system.
All attributes are filled by the system once the SafeBox is successfully created (sent).

Attribute            | Definition
---------------------|-----------
guid                 | The unique identifier of the SafeBox.
previewUrl           | The URL to access the SafeBox in the SendSecure Web Portal.
encryptionKey        | The key that may be required to decrypt the SafeBox content (only if Double Encryption is enabled in the Security Profile).

<a name="recipient"></a>
### Recipient

Builds an object to create a recipient for the SafeBox.

Attribute            | Definition
---------------------|-----------
email                | The email address of the recipient (mandatory).
firstName            | The first name of the recipient (optional).
lastName             | The last name of the recipient (optional).
companyName          | The company name of the recipient (optional).
contactMethods       | The list of all [ContactMethod](#contactmethod) objects of the recipient (may be mandatory depending on the Security Profile of the SafeBox).

<a name="contactmethod"></a>
### ContactMethod

Builds an object to create a phone number destination owned by the recipient (as part of the Recipient object attributes).
Any ContactMethod – plus the recipient's email address – will be usable as Security Code delivery means to the recipient.
All attributes are mandatory.

Attribute            | Definition
---------------------|-----------
destination          | A phone number owned by the recipient.
destinationType      | The phone number's type (i.e. home/cell/office/other).


<a name="attachment"></a>
### Attachment

Builds an object to be uploaded to the server as attachment of the SafeBox.
Can be created either with a [File Path](#filepath), a [File](#file) or a [Stream](#stream).
All attributes are mandatory.

<a name="filepath"></a>
#### File Path

Attribute            | Definition
---------------------|-----------
guid                 | The unique identifier of the attachment (filled by the system once the file is uploaded).
filename             | The path (full filename) of the file to upload.

<a name="file"></a>
#### File

Attribute            | Definition
---------------------|-----------
guid                 | The unique identifier of the attachment (filled by the system once the file is uploaded).
file                 | The file object to upload.

<a name="stream"></a>
#### Stream

Attribute            | Definition
---------------------|-----------
guid                 | The unique identifier of the attachment (filled by the system once the file is uploaded).
contentType          | The file Content-type (MIME).
stream               | The data to upload.
filename             | The file name.

### SecurityProfile

Represents the settings of a Security Profile.
The use of specific attributes of this object rather takes place in advanced scenarios.
To know all available attributes, please look in the library.

### EnterpriseSettings

Represents the SendSecure settings of an Enterprise Account.
The use of specific attributes of this object rather takes place in advanced scenarios.
To know all available attributes, please look in the library.

### ExtensionFilter

Represents the list of allowed/forbidden extensions for SafeBox attachments (part of the EnterpriseSettings).
The use of specific attributes of this object rather takes place in advanced scenarios.
To know all available attributes, please look in the library.

<a name="license"></a>
# License

sendsecure-js is distributed under [MIT License](https://github.com/xmedius/sendsecure-js/blob/master/LICENSE).

<a name="credits"></a>
# Credits

sendsecure-js is developed, maintained and supported by [XMedius Solutions Inc.](https://www.xmedius.com?source=sendsecure-js)
The names and logos for sendsecure-js are trademarks of XMedius Solutions Inc.

![XMedius Logo](https://s3.amazonaws.com/xmc-public/images/xmedius-site-logo.png)
