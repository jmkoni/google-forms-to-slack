/**
 * This function is triggered when a response is submitted to the Google Form.
 * It retrieves the form response and sends it as a message to a Slack channel using a webhook.
 * For file uploads, it gets the file URLs and includes them in the message.
 * Make sure to replace slackWebhookUrl with your own Slack webhook URL.
 * 
 * @param {Object} event - The form submit event.
 */
function onFormSubmit(event) {
  // Get the form response and item responses.
  var formResponse = event.response;
  var itemResponses = formResponse.getItemResponses();

  // Initialize an empty object to store the form data.
  var formData = {};

  // Loop through each item response and add it to the formData object.
  for (var i = 0; i < itemResponses.length; i++) {
    var thisItem = itemResponses[i];
    var question = thisItem.getItem().getTitle();
    var answer = thisItem.getResponse();
    
    // If the item is a file upload, get the file URLs and store them in an array.
    if (thisItem.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) {
      var fileUrls = [];
      
      if (typeof answer === 'string') {
        // If answer is a string, assume it's a single file ID.
        var fileId = answer.trim();
        var fileUrl = DriveApp.getFileById(fileId).getUrl();
        fileUrls.push(fileUrl);
      } else if (Array.isArray(answer)) {
        // If answer is an array, assume it's already an array of file IDs.
        for (var j = 0; j < answer.length; j++) {
          var fileId = answer[j].trim();
          var fileUrl = DriveApp.getFileById(fileId).getUrl();
          fileUrls.push(fileUrl);
        }
      }
      
      formData[question] = fileUrls;
    } else if (Array.isArray(answer)) {
      // If the answer is an array, convert it to a comma-separated string.
      formData[question] = answer.join(', ');
    } else {
      formData[question] = answer;
    }
  }
  
  // Set up the Slack message payload.
  var slackWebhookUrl = 'https://hooks.slack.com/services/xxxxx/xxxxxxx/xxxxxx'; // Replace with your own Slack webhook URL.
  var payload = {
    'blocks': []
  }
  
  // Loop through each question in the formData object and add it as a field in the message attachment.
  for (var key in formData) {
    var value = formData[key];
    // handle optional questions that aren't answered
    if (value == '' || value == null) {
      continue;
    }
    if (Array.isArray(value)) {
      value = value.join('\n'); // Join file URLs with new lines.
    }
    // IMO this makes a nicely formatted message
    var field = {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': `*${key}:* ${value}`
      }
    }

    payload.blocks.push(field);
  }
  
  // Set up the options for the UrlFetchApp.fetch() method.
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };
  
  // Send the message to the Slack channel using the webhook.
  UrlFetchApp.fetch(slackWebhookUrl, options);
}
