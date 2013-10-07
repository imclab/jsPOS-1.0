//corpus.js
/**
*
* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 2.0
*
* The contents of this file are subject to the Mozilla Public License Version
* 2.0 (the "License"); you may not use this file except in compliance with
* the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/2.0/
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), 
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, 
* EXCEPT FOR sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above permissions granted within the boundaries of a NON-COMMERCIAL PROJECT, 
* copyright notice with this permission notice must be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
* The Initial Developer of the Original Code is ZLudany, BookingShare.net.
* Portions created by the Initial Developer are Copyright (C) 2002-2013
* by the Initial Developer. All Rights Reserved.
*
* ***** END LICENSE BLOCK ***** */
(function(name, factory){
    typeof require == "undefined" ?
            // pure browser;
            factory(self) :
            typeof module.exports == "undefined" ?
                // browser AMD loader or RequireJS
                define(name, ["exports"], factory) :
                // CommonJS environment
                factory(module.exports);
})("POSTagger_test", function(exports){
   //we need to use eval, so do not "use strict"
   //"use strict";
   if(typeof require != 'undefined'){
      require('../../../z/utils/it.js');
      require('../../../z/utils/enumerable.js');
      require('../../../z/utils/z.js');
      require('POSTagger.js');
   }

   var version = "2.5.1";

   exports.POSTagger.test={};

   exports.POSTagger.test.testString = 
    "2. "+
    "Information We Receive 3. "+
    "Sharing information on Facebook 4. "+
    "Information You Share With Third Parties 5. "+
    "How We Use Your Information 6. "+
    "How We Share Information 7. "+
    "How You Can Change or Remove Information 8. "+
    "How We Protect Information 2.Information We Receive Information you provide to us: Information About Yourself. "+
    "When you sign up for Facebook you provide us with your name, email, gender, and birth date. "+
    "During the registration process we give you the opportunity to connect with your friends, schools, and employers. "+
    "You will also be able to add a picture of yourself. "+
    "In some cases we may ask for additional information for security reasons or to provide specific services to you. "+
    "Once you register you can provide other information about yourself by connecting with, for example, your current city, hometown, family, relationships, networks, activities, interests, and places. "+
    "You can also provide personal information about yourself, such as your political and religious views. "+
    "Content. "+
    "One of the primary reasons people use Facebook is to share content with others. "+
    "Examples include when you update your status, upload or take a photo, upload or record a video, share a link, create an event or a group, make a comment, write something on someone’s Wall, write a note, or send someone a message. "+
    "If you do not want us to store metadata associated with content you share on Facebook (such as photos), please remove the metadata before uploading the content. "+
    "Transactional Information. "+
    "We may retain the details of transactions or payments you make on Facebook. "+
    "If you do not want us to store your payment source account number, you can remove it using your payments page. "+
    "Friend Information. "+
    "We offer contact importer tools to help you upload your friends’ addresses so that you can find your friends on Facebook, and invite your contacts who do not have Facebook accounts to join. "+
    "If you do not want us to store this information, visit this help page. "+
    "If you give us your password to retrieve those contacts, we will not store your password after you have uploaded your contacts’ information. "+
    "Information we collect when you interact with Facebook: Site activity information. "+
    "We keep track of some of the actions you take on Facebook, such as adding connections (including joining a group or adding a friend), creating a photo album, sending a gift, poking another user, indicating you “like” a post, attending an event, or connecting with an application. "+
    "In some cases you are also taking an action when you provide information or content to us. "+
    "For example, if you share a video, in addition to storing the actual content you uploaded, we might log the fact that you shared it. "+
    "Access Device and Browser Information. "+
    "When you access Facebook from a computer, mobile phone, or other device, we may collect information from that device about your browser type, location, and IP address, as well as the pages you visit. "+
    "Cookie Information. "+
    "We use “cookies” (small pieces of data we store for an extended period of time on your computer, mobile phone, or other device) to make Facebook easier to use, to make our advertising better, and to protect both you and Facebook. "+
    "For example, we use them to store your login ID (but never your password) to make it easier for you to login whenever you come back to Facebook. "+
    "We also use them to confirm that you are logged into Facebook, and to know when you are interacting with Facebook Platform applications and websites, our widgets and Share buttons, and our advertisements. "+
    "You can remove or block cookies using the settings in your browser, but in some cases that may impact your ability to use Facebook. "+
    "Information we receive from third parties: Facebook Platform. "+
    "Whenever you connect with a Platform application or website, we will receive information from them, including information about actions you take. "+
    "In some cases, in order to personalize the process of connecting, we may receive a limited amount of information even before you connect with the application or website. "+
    "Information from other websites. "+
    "We may institute programs with advertising partners and other websites in which they share information with us: We may ask advertisers to tell us how our users responded to the ads we showed them (and for comparison purposes, how other users who didn’t see the ads acted on their site). "+
    "This data sharing, commonly known as “conversion tracking,” helps us measure our advertising effectiveness and improve the quality of the advertisements you see. "+
    "We may receive information about whether or not you’ve seen or interacted with certain ads on other sites in order to measure the effectiveness of those ads. "+
    "Information from other users. "+
    "We may collect information about you from other Facebook users, such as when a friend tags you in a photo, video, or place, provides friend details, or indicates a relationship with you. "+
    "3. "+
    "Sharing information on Facebook. "+
    "Name and Profile Picture. "+
    "Facebook is designed to make it easy for you to find and connect with others. "+
    "For this reason, your name and profile picture do not have privacy settings. "+
    "If you are uncomfortable with sharing your profile picture, you should delete it (or not add one). "+
    "You can also control who can find you when searching on Facebook or on public search engines using the Applications and Websites privacy setting. "+
    "Contact Information. "+
    "Your contact information settings control (available when customizing your privacy settings) who can contact you on Facebook, and who can see your contact information such as your email and phone number(s). "+
    "Remember that none of this information is required except for your email address, and you do not have to share your email address with anyone. "+
    "Personal Information. "+
    "Your personal information settings control who can see your personal information, such as your religious and political views, if you choose to add them. "+
    "We recommend that you share this information using the friends of friends setting. "+
    "Posts by Me. "+
    "You can select a privacy setting for every post you make using the publisher on our site. "+
    "Whether you are uploading a photo or posting a status update, you can control exactly who can see it at the time you create it. "+
    "Whenever you share something look for the lock icon. "+
    "Clicking on the lock will bring up a menu that lets you choose who will be able to see your post. "+
    "If you decide not to select your setting at the time you post the content, your content will be shared consistent with your Posts by Me default privacy (available when customizing your privacy settings). "+
    "Gender and Birth Date. "+
    "In addition to name and email address, we require you to provide your gender and birth date during the registration process. "+
    "We ask for your date of birth to verify that you are 13 or older, and so that we can better limit your access to content and advertisements that are not age appropriate. "+
    "Because your date of birth and gender are required, you cannot delete them. "+
    "You can, however, edit your profile to hide all (or part) of such fields from other users. "+
    "Other. "+
    "Here are some other things to remember: * Some of the content you share and the actions you take will show up on your friends’ home pages and other pages they visit. "+
    "* If another user tags you in a photo or video or at a place, you can remove the tag. "+
    "You can also limit who can see that you have been tagged on your profile from your privacy settings. "+
    "* Even after you remove information from your profile or delete your account, copies of that information may remain viewable elsewhere to the extent it has been shared with others, it was otherwise distributed pursuant to your privacy settings, or it was copied or stored by other users. "+
    "* You understand that information might be reshared or copied by other users. "+
    "* Certain types of communications that you send to other users cannot be removed, such as messages. "+
    "* When you post information on another user’s profile or comment on another user’s post, that information will be subject to the other user’s privacy settings. "+
    "* If you use an external source to publish information to Facebook (such as a mobile application or a Connect site), you should check the privacy setting for that post, as it is set by that external source. "+
    "“Everyone” Information. "+
    "Information set to “everyone” is publicly available information, just like your name, profile picture, and connections. "+
    "Such information may, for example, be accessed by everyone on the Internet (including people not logged into Facebook), be indexed by third party search engines, and be imported, exported, distributed, and redistributed by us and others without privacy limitations. "+
    "Such information may also be associated with you, including your name and profile picture, even outside of Facebook, such as on public search engines and when you visit other sites on the internet. "+
    "The default privacy setting for certain types of information you post on Facebook is set to “everyone. "+
    "” You can review and change the default settings in your privacy settings. "+
    "If you delete “everyone” content that you posted on Facebook, we will remove it from your Facebook profile, but have no control over its use outside of Facebook. "+
    "Minors. "+
    "We reserve the right to add special protections for minors (such as to provide them with an age-appropriate experience) and place restrictions on the ability of adults to share and connect with minors, recognizing this may provide minors a more limited experience on Facebook 4. "+
    "Information You Share With Third Parties. "+
    "Facebook Platform. "+
    "As mentioned above, we do not own or operate the applications or websites that use Facebook Platform. "+
    "That means that when you use those applications and websites you are making your Facebook information available to someone other than Facebook. "+
    "Prior to allowing them to access any information about you, we require them to agree to terms that limit their use of your information (which you can read about in Section 9 of our Statement of Rights and Responsibilities) and we use technical measures to ensure that they only obtain authorized information. "+
    "To learn more about Platform, visit our About Platformpage. "+
    "Connecting with an Application or Website. "+
    "When you connect with an application or website it will have access to General Information about you. "+
    "The term General Information includes your and your friends’ names, profile pictures, gender, user IDs, connections, and any content shared using the Everyone privacy setting. "+
    "We may also make information about the location of your computer or access device and your age available to applications and websites in order to help them implement appropriate security measures and control the distribution of age-appropriate content. "+
    "If the application or website wants to access any other data, it will have to ask for your permission. "+
    "We give you tools to control how your information is shared with applications and websites that use Platform. "+
    "For example, you can block all platform applications and websites completely or block specific applications from accessing your information by visiting your Applications and Websites privacy setting or the specific application’s “About” page. "+
    "You can also use your privacy settings to limit which of your information is available to “everyone”. "+
    "You should always review the policies of third party applications and websites to make sure you are comfortable with the ways in which they use information you share with them. "+
    "We do not guarantee that they will follow our rules. "+
    "If you find an application or website that violates our rules, you should report the violation to us on this help pageand we will take action as necessary. "+
    "When your friends use Platform. "+
    "If your friend connects with an application or website, it will be able to access your name, profile picture, gender, user ID, and information you have shared with “everyone”. "+
    "It will also be able to access your connections, except it will not be able to access your friend list. "+
    "If you have already connected with (or have a separate account with) that website or application, it may also be able to connect you with your friend on that application or website. "+
    "If the application or website wants to access any of your other content or information (including your friend list), it will have to obtain specific permission from your friend. "+
    "If your friend grants specific permission to the application or website, it will generally only be able to access content and information about you that your friend can access. "+
    "In addition, it will only be allowed to use that content and information in connection with that friend. "+
    "For example, if a friend gives an application access to a photo you only shared with your friends, that application could allow your friend to view or print the photo, but it cannot show that photo to anyone else. "+
    "We provide you with a number of tools to control how your information is shared when your friend connects with an application or website. "+
    "For example, you can use your Application and Websites privacy setting to limit some of the information your friends can make available to applications and websites. "+
    "You can block all platform applications and websites completely or block particular applications or websites from accessing your information. "+
    "You can use your privacy settings to limit which friends can access your information, or limit which of your information is available to “everyone”. "+
    "You can also disconnect from a friend if you are uncomfortable with how they are using your information. "+
    "Pre-Approved Third-Party Websites and Applications. "+
    "In order to provide you with useful social experiences off of Facebook, we occasionally need to provide General Information about you to pre-approved third party websites and applications that use Platform at the time you visit them (if you are still logged in to Facebook). "+
    "Similarly, when one of your friends visits a pre-approved website or application, it will receive General Information about you so you and your friend can be connected on that website as well (if you also have an account with that website). "+
    "In these cases we require these websites and applications to go through an approval process, and to enter into separate agreements designed to protect your privacy. "+
    "For example, these agreements include provisions relating to the access and deletion of your General Information, along with your ability to opt-out of the experience being offered. "+
    "You can disable instant personalization on all pre-approved websites and applications using your Applications and Websites privacy setting. "+
    "You can also block a particular pre-approved website or application by clicking “No Thanks” in the blue bar when you visit that application or website. "+
    "In addition, if you log out of Facebook before visiting a pre-approved application or website, it will not be able to access your information. "+
    "Exporting Information. "+
    "You (and those you make your information available to) may use tools like RSS feeds, mobile phone address book applications, or copy and paste functions, to capture, export (and in some cases, import) information from Facebook, including your information and information about you. "+
    "For example, if you share your phone number with your friends, they may use third party applications to sync that information with the address book on their mobile phone. "+
    "Advertisements. "+
    "Sometimes the advertisers who present ads on Facebook use technological methods to measure the effectiveness of their ads and to personalize advertising content. "+
    "You may opt-out of the placement of cookies by many of these advertisers here. "+
    "You may also use your browser cookie settings to limit or prevent the placement of cookies by advertising networks. "+
    "Facebook does not share personally identifiable information with advertisers unless we get your permission. "+
    "Links. "+
    "When you click on links on Facebook you may leave our site. "+
    "We are not responsible for the privacy practices of other sites, and we encourage you to read their privacy statements. "+
    "5. "+
    "How We Use Your Information We use the information we collect to try to provide a safe, efficient, and customized experience. "+
    "Here are some of the details on how we do that: To manage the service. "+
    "We use the information we collect to provide our services and features to you, to measure and improve those services and features, and to provide you with customer support. "+
    "We use the information to prevent potentially illegal activities, and to enforce our Statement of Rights and Responsibilities. "+
    "We also use a variety of technological systems to detect and address anomalous activity and screen content to prevent abuse such as spam. "+
    "These efforts may on occasion result in a temporary or permanent suspension or termination of some functions for some users. "+
    "To contact you. "+
    "We may contact you with service-related announcements from time to time. "+
    "You may opt out of all communications except essential updates on your account notificationspage. "+
    "We may include content you see on Facebook in the emails we send to you. "+
    "To serve personalized advertising to you. "+
    "We don’t share your information with advertisers without your consent. "+
    "(An example of consent would be if you asked us to provide your shipping address to an advertiser to receive a free sample.) We allow advertisers to choose the characteristics of users who will see their advertisements and we may use any of the non-personally identifiable attributes we have collected (including information you may have decided not to show to other users, such as your birth year or other sensitive personal information or preferences) to select the appropriate audience for those advertisements. "+
    "For example, we might use your interest in soccer to show you ads for soccer equipment, but we do not tell the soccer equipment company who you are. "+
    "You can see the criteria advertisers may select by visiting our advertising page. "+
    "Even though we do not share your information with advertisers without your consent, when you click on or otherwise interact with an advertisement there is a possibility that the advertiser may place a cookie in your browser and note that it meets the criteria they selected. "+
    "To serve social ads. "+
    "We occasionally pair advertisements we serve with relevant information we have about you and your friends to make advertisements more interesting and more tailored to you and your friends. "+
    "For example, if you connect with your favorite band’s page, we may display your name and profile photo next to an advertisement for that page that is displayed to your friends. "+
    "We only share the personally identifiable information visible in the social ad with the friend who can see the ad. "+
    "You can opt out of having your information used in social ads on this help page. "+
    "To supplement your profile. "+
    "We may use information about you that we collect from other Facebook users to supplement your profile (such as when you are tagged in a photo or mentioned in a status update). "+
    "In such cases we generally give you the ability to remove the content (such as allowing you to remove a photo tag of you) or limit its visibility on your profile. "+
    "To make suggestions. "+
    "We use your profile information, the addresses you import through our contact importers, and other relevant information, to help you connect with your friends, including making suggestions to you and other users that you connect with on Facebook. "+
    "For example, if another user imports the same email address as you do, we may suggest that you connect with each other. "+
    "If you want to limit your visibility in suggestions we make to other people, you can adjust your search visibility privacy setting, as you will only be visible in our suggestions to the extent you choose to be visible in public search listings. "+
    "You may also block specific individual users from being suggested to you and you from being suggested to them. "+
    "To help your friends find you. "+
    "We allow other users to use contact information they have about you, such as your email address, to find you, including through contact importers and search. "+
    "You can prevent other users from using your email address to find you using the search section of your privacy settings. "+
    "Downloadable Software. "+
    "Certain downloadable software applications and applets that we offer, such as our browser toolbars and photo uploaders, transmit data to us. "+
    "We may not make a formal disclosure if we believe our collection of and use of the information is the obvious purpose of the application, such as the fact that we receive photos when you use our photo uploader. "+
    "If we believe it is not obvious that we are collecting or using such information, we will make a disclosure to you the first time you provide the information to us so that you can decide whether you want to use that feature. "+
    "Memorializing Accounts. "+
    "If we are notifiedthat a user is deceased, we may memorialize the user’s account. "+
    "In such cases we restrict profile access to confirmed friends, and allow friends and family to write on the user’s Wall in remembrance. "+
    "We may close an account if we receive a formal request from the user’s next of kin or other proper legal request to do so. "+
    "6. "+
    "How We Share Information Facebook is about sharing information with others — friends and people in your communities — while providing you with privacy settings that you can use to restrict other users from accessing some of your information. "+
    "We share your information with third parties when we believe the sharing is permitted by you, reasonably necessary to offer our services, or when legally required to do so. "+
    "For example: When you make a payment. "+
    "When you enter into transactions with others or make payments on Facebook, we will share transaction information with only those third parties necessary to complete the transaction. "+
    "We will require those third parties to agree to respect the privacy of your information. "+
    "When you invite a friend to join. "+
    "When you ask us to invite a friend to join Facebook, we will send your friend a message on your behalf using your name. "+
    "The invitation may also contain information about other users your friend might know. "+
    "We may also send up to two reminders to them in your name. "+
    "You can see who has accepted your invitations, send reminders, and delete your friends’ email addresses on your invite history page. "+
    "If your friend does not want us to keep their information, we will also remove it at their request by using this help page. "+
    "When you choose to share your information with marketers. "+
    "You may choose to share information with marketers or electronic commerce providers that are not associated with Facebook through on-site offers. "+
    "This is entirely at your discretion and we will not provide your information to these marketers without your consent. "+
    "To help your friends find you. "+
    "By default, we make certain information you have posted to your profile available in search results on Facebook to help your friends find you. "+
    "However, you can control who can see some of this information, as well as who can find you in searches, through your privacy settings. "+
    "We also partner with email and instant messaging providers to help their users identify which of their contacts are Facebook users, so that we can promote Facebook to those users. "+
    "To give search engines access to publicly available information. "+
    "We generally limit search engines’ access to our site. "+
    "We may allow them to access information set to the “everyone” setting (along with your name and profile picture) and your profile information that is visible to everyone. "+
    "You can change the visibility of some of your profile information using the customize section of your privacy settings. "+
    "You can also prevent search engines from indexing your profile using the Applications and Websites privacy setting. "+
    "To help improve or promote our service. "+
    "Sometimes we share aggregated information with third parties to help improve or promote our service. "+
    "But we only do so in such a way that no individual user can be identified or linked to any specific action or information. "+
    "To provide you with services. "+
    "We may provide information to service providers that help us bring you the services we offer. "+
    "For example, we may use third parties to help host our website, send out email updates about Facebook, remove repetitive information from our user lists, process payments, or provide search results or links (including sponsored links). "+
    "These service providers may have access to your personal information for use for a limited time, but when this occurs we implement reasonable contractual and technical protections to limit their use of that information to helping us provide the service. "+
    "To advertise our services. "+
    "We may ask advertisers outside of Facebook to display ads promoting our services. "+
    "We may ask them to deliver those ads based on the presence of a cookie, but in doing so will not share any other information with the advertiser. "+
    "To offer joint services. "+
    "We may provide services jointly with other companies, such as the classifieds service in the Facebook Marketplace. "+
    "If you use these services, we may share your information to facilitate that service. "+
    "However, we will identify the partner and present the joint service provider’s privacy policy to you before you use that service. "+
    "To respond to legal requests and prevent harm. "+
    "We may disclose information pursuant to subpoenas, court orders, or other requests (including criminal and civil matters) if we have a good faith belief that the response is required by law. "+
    "This may include respecting requests from jurisdictions outside of the United States where we have a good faith belief that the response is required by law under the local laws in that jurisdiction, apply to users from that jurisdiction, and are consistent with generally accepted international standards. "+
    "We may also share information when we have a good faith belief it is necessary to prevent fraud or other illegal activity, to prevent imminent bodily harm, or to protect ourselves and you from people violating our Statement of Rights and Responsibilities. "+
    "This may include sharing information with other companies, lawyers, courts or other government entities. "+
    "Transfer in the Event of Sale or Change of Control. "+
    "If the ownership of all or substantially all of our business changes, we may transfer your information to the new owner so that the service can continue to operate. "+
    "In such a case, your information would remain subject to the promises made in any pre-existing Privacy Policy. "+
    "7. "+
    "How You Can Change or Remove Information Editing your profile. "+
    "You may change or remove your profile information at any time by going to your profile page and clicking “Edit My Profile.” Information will be updated immediately. "+
    "Delete uploaded contacts. "+
    "If you use our contact importer to upload addresses, you can later delete the list on this help page. "+
    "You can delete the email addresses of friends you have invited to join Facebook on your invite history page. "+
    "Deactivating or deleting your account. "+
    "If you want to stop using your account you may deactivate it or delete it. "+
    "When you deactivate an account, no user will be able to see it, but it will not be deleted. "+
    "We save your profile information (connections, photos, etc.) in case you later decide to reactivate your account. "+
    "Many users deactivate their accounts for temporary reasons and in doing so are asking us to maintain their information until they return to Facebook. "+
    "You will still have the ability to reactivate your account and restore your profile in its entirety. "+
    "When you delete an account, it is permanently deleted from Facebook. "+
    "You should only delete your account if you are certain you never want to reactivate it. "+
    "You may deactivate your account on your account settings page or delete your account on this help page. "+
    "Limitations on removal. "+
    "Even after you remove information from your profile or delete your account, copies of that information may remain viewable elsewhere to the extent it has been shared with others, it was otherwise distributed pursuant to your privacy settings, or it was copied or stored by other users. "+
    "However, your name will no longer be associated with that information on Facebook. "+
    "(For example, if you post something to another user’s profile and then you delete your account, that post may remain, but be attributed to an “Anonymous Facebook User.”) Additionally, we may retain certain information to prevent identity theft and other misconduct even if deletion has been requested. "+
    "If you have given third party applications or websites access to your information, they may retain your information to the extent permitted under their terms of service or privacy policies. "+
    "But they will no longer be able to access the information through our Platform after you disconnect from them. "+
    "Backup copies. "+
    "Removed and deleted information may persist in backup copies for up to 90 days, but will not be available to others. "+
    "Non-user contact information. "+
    "If a user provides your email address to us, and you are not a Facebook user but you want us to delete your address, you can do so on this help page. "+
    "However, that request will only apply to addresses we have at the time of the request and not to any addresses that users provide to us later. "+
    "Risks inherent in sharing information. "+
    "Although we allow you to set privacy options that limit access to your information, please be aware that no security measures are perfect or impenetrable. "+
    "We cannot control the actions of other users with whom you share your information. "+
    "We cannot guarantee that only authorized persons will view your information. "+
    "We cannot ensure that information you share on Facebook will not become publicly available. "+
    "We are not responsible for third party circumvention of any privacy settings or security measures on Facebook. "+
    "You can reduce these risks by using common sense security practices such as choosing a strong password, using different passwords for different services, and using up to date antivirus software. ";

    Object.defineProperty(exports.POSTagger.test,"version",{value:version,enumerable:false});

    return exports;
});
