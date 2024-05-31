# Forms-to-Slack

### Description:
Simple script to post Google Forms responses to a Slack channel


### How to set it up in Slack:

1. Go to https://api.slack.com/apps and create a new app.
2. In the app settings, navigate to "Incoming Webhooks" and enable it.
3. Add a new webhook to your workspace and customize its name and icon, if desired.
4. Copy the webhook URL, as it will be used in the Google Forms script.

### Now that you have your webhook URL, you can set up the Google Forms script:

1. Open the Google Form you want to use and click on the "More" button (three dots) in the top right corner.
2. Select "Script editor" from the dropdown menu.
3. In the script editor, paste the script provided into the editor and save the script file.
4. Click on "Triggers" from the "Edit" menu, select "Add Trigger".
5. Set "Choose which function to run" to "onFormSubmit"
6. Set "Select event source" to "From form".
7. Set "Select event type" to "On form submit".
8. Click on "Save".
