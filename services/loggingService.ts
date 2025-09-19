/**
 * IMPORTANT: To switch to Google Sheet logging, you must update your Google Apps Script.
 * 1. Open your Google Sheet page, then go to Extensions > Apps Script.
 * 2. Paste the following NEW code into the script editor, REPLACING ALL existing code.
 *
 *    function doPost(e) {
 *      // Try to get a lock to prevent concurrent writes, wait up to 30 seconds.
 *      var lock = LockService.getScriptLock();
 *      var success = lock.tryLock(30000);
 *      if (!success) {
 *        // If we can't get a lock, we return an error.
 *        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": "Could not obtain lock to write to sheet." }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      }
 *
 *      try {
 *        // The script will write to the first sheet in your spreadsheet file.
 *        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *        
 *        // If the sheet is empty, add a header row.
 *        if (sheet.getLastRow() === 0) {
 *          sheet.appendRow(["時間戳記", "使用者提問", "AI 回覆"]);
 *        }
 *
 *        // Extract parameters sent from the frontend
 *        var params = e.parameter;
 *        var question = params.question || "No question provided";
 *        var answer = params.answer || "No answer provided";
 *        var timestamp = new Date();
 *
 *        // Append the new interaction as a new row
 *        sheet.appendRow([timestamp, question, answer]);
 *
 *        // Return a success response
 *        return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Row added." }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *
 *      } catch (error) {
 *        // Log any errors for debugging in the Apps Script console
 *        console.error("Error in doPost: " + error.toString());
 *        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      } finally {
 *        // Always release the lock to allow other processes to continue.
 *        lock.releaseLock();
 *      }
 *    }
 *
 * 3. Click "Deploy" > "New deployment".
 * 4. For "Select type" (gear icon), choose "Web app".
 * 5. Under "Configuration":
 *    - Give it a new description (e.g., "Chatbot Sheet Logger v2").
 *    - Ensure "Execute as" is "Me (your email)".
 *    - Ensure "Who has access" is "Anyone".
 * 6. Click "Deploy". You will likely need to re-authorize permissions for Google Sheets.
 * 7. A new "Web app URL" will be generated. Copy it and paste it into the `GOOGLE_SCRIPT_URL` variable below.
 *    If you use the same project, the URL might not change, but you MUST redeploy to activate the new script code.
 */
const GOOGLE_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbwc8m1CFw8OzMquaoSY0JgZItn8ibFoDZukuOz451qsio6DHqjC1BS9oeqskqgvFmDP/exec';
const PLACEHOLDER_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

/**
 * Logs a user's question and the AI's answer by sending it to a Google Sheet
 * via a Google Apps Script Web App.
 * This is a "fire-and-forget" function; it sends the data but doesn't wait for a response
 * to ensure the UI remains responsive.
 * @param question The user's question to log.
 * @param answer The AI's answer to log.
 */
export const logInteraction = (question: string, answer: string): void => {
  // This check prevents sending requests to a non-existent or placeholder URL.
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === PLACEHOLDER_URL) {
    console.warn('Google Script URL is not configured. Please update the URL in services/loggingService.ts. Skipping interaction logging.');
    return;
  }

  const formData = new FormData();
  formData.append('question', question);
  formData.append('answer', answer);

  // We are not using application/json because sending data as a form is more reliable
  // with Google Apps Script when called from a browser client.
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // 'no-cors' is required for cross-origin requests to Google Scripts from a browser.
    body: new URLSearchParams(formData as any),
  }).catch(error => {
    // We only log the error to the console. We don't want logging failures to break the chat experience.
    console.error('Error sending interaction to Google Script:', error);
  });
};
