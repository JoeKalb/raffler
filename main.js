let ticketRates = {
  'dollar': "NA",
  'bits': "NA",
  'stream currency': "NA",
  'subs': "NA"
}

function scrollToBottom(){
  document.body.scrollIntoView({behavior: "smooth", block: "end"})
}

function scrollToTop(){
  document.body.scrollIntoView({behavior: "smooth", block:"start"})
}

let entries = 0;
function setRates(){
  ticketRates.dollar = Number(document.getElementById("dollarRate").value) || "NA"
  ticketRates.bits = Number(document.getElementById("bitsRate").value) || "NA"
  ticketRates["stream currency"] = Number(document.getElementById("sCRate").value) || "NA"
  ticketRates.subs = Number(document.getElementById("subRate").value) || "NA"
  displayRates()

  makeBlur("dollarRate")
  makeBlur("bitsRate")
  makeBlur("sCRate")
  makeBlur("subRate")

  localStorage.setItem("ticketRates", JSON.stringify(ticketRates))
  if(entries != 0)
    recalcEntries();

  scrollToBottom();
}

function makeBlur(id){
  document.getElementById(id).blur()
}

function displayRates(){
  // update rates
  document.getElementById("displayDollarRate").innerHTML = ticketRates.dollar
  document.getElementById("displayBitsRate").innerHTML = ticketRates.bits
  document.getElementById("displayStreamCurrencyRate").innerHTML = ticketRates["stream currency"]
  document.getElementById("displayStreamSubRate").innerHTML = ticketRates.subs
  // show rates
  document.getElementById("displayRates").style.display = "block"
  document.getElementById("addEntry").style.display = "block"
}

function recalcEntries(){
  for(user in userEntries){
    addEntry(userEntries[user].name, 
      userEntries[user].dollar, 
      userEntries[user].bits, 
      userEntries[user].currency,
      userEntries[user].subs,
      userEntries[user].initTickets)
    displayEntry(userEntries[user])
  }
}

// grab data, add to array of objects, make card, display draw winner area
function submitEntry(){
  let name = document.getElementById("userName").value.trim();
  let initTickets = Number(document.getElementById("userInitialTickets").value) || 0;
  let dollar = Number(document.getElementById("userDollar").value) || 0;
  let bits = Number(document.getElementById("userBits").value) || 0;
  let currency = Number(document.getElementById("userCurrency").value) || 0;
  let subs = Number(document.getElementById("userSubs").value) || 0;
  document.getElementById("userName").disabled = false;
  // make sure username is available before adding entries
  if(name != ""){

    // add values to userEntries array
    let newEntry = addEntry(name, dollar, bits, currency, subs, initTickets)
    // display new Entry
    displayEntry(newEntry);

    // clear ticket inputs
    document.getElementById("userName").value = "";
    clearUserInputs()
    
    if(document.getElementById("entries").style.display != "block") {
      document.getElementById("entries").style.display = "block"
    }

    document.getElementById("userName").focus();

    if(entries == 1){
      scrollToBottom();
    }

    //++entries; swapped increase entries to displayEntry
  } 
  else{
    document.getElementById("userName").focus();
  }
}

function clearUserInputs(){
  document.getElementById("userInitialTickets").value = "";
  document.getElementById("userDollar").value = "";
  document.getElementById("userBits").value = "";
  document.getElementById("userCurrency").value = "";
  document.getElementById("userSubs").value = "";
}

// array of all users currenty entered
let userEntries = {}
function addEntry(name, dollar, bits, currency, subs, initTickets) {

  try{
    name = name.toUpperCase().trim()
  }
  catch(err){
    console.log(err)
  }
  
  let newEntry = {
    "name": name,
    "dollar": dollar,
    "bits": bits,
    "currency": currency,
    "subs": subs,
    "initTickets":initTickets || 0,
    "tickets":0
  }
  newEntry.tickets = ticketCalc(dollar, bits, currency, subs, initTickets || 0)

  userEntries[name] = newEntry

  localStorage.setItem(name, JSON.stringify(newEntry))

  return newEntry
}

// will round down values so fractions do not count
function ticketCalc(dollar, bits, currency, subs, initTickets){
  let tickets = initTickets;

  tickets += (ticketRates.dollar == "NA") ? 
    0 : Math.floor(dollar/ticketRates.dollar)
  tickets += (ticketRates.bits == "NA") ? 
    0 : Math.floor(bits/ticketRates.bits)
  tickets += (ticketRates["stream currency"] == "NA") ? 
    0 : Math.floor(currency/ticketRates["stream currency"])
  tickets += (ticketRates.subs == "NA") ?
    0 : Math.floor(subs/ticketRates.subs)

  return tickets;
}

function displayEntry(newEntry){

  if(document.getElementById("userCard" + newEntry.name)){
    editUserCard(newEntry)
  }
  else{
    ++entries;
    let newEntryCard = document.createElement('div');
    newEntryCard.className = "card";
    newEntryCard.id = "userCard" + newEntry.name;
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";
    newEntryCard.appendChild(cardBody);

    // add attributes 
    let cardUserName = document.createElement('h5');
    cardUserName.className = "card-title";
    cardUserName.innerHTML = newEntry.name;
    cardBody.appendChild(cardUserName);

    let usersTickets = document.createElement('h6');
    usersTickets.className = "card-subtitle";
    usersTickets.innerHTML = `TOTAL TICKETS: ${newEntry.tickets}`;
    cardBody.appendChild(usersTickets);

    let usersInitTickets = document.createElement('p');
    usersInitTickets.className = "card-text inner-p";
    usersInitTickets.innerHTML = `Initial Tickets: ${newEntry.initTickets}`
    cardBody.appendChild(usersInitTickets);

    let userDollarDisplay = document.createElement('p');
    userDollarDisplay.className = "card-text inner-p";
    userDollarDisplay.innerHTML = "$ " + newEntry.dollar;
    cardBody.appendChild(userDollarDisplay);

    let userBitsDisplay = document.createElement('p');
    userBitsDisplay.className = "card-text inner-p";
    userBitsDisplay.innerHTML = "Bits: " + newEntry.bits;
    cardBody.appendChild(userBitsDisplay);

    let userStreamCurrencyDisplay = document.createElement('p');
    userStreamCurrencyDisplay.className = "card-text inner-p";
    userStreamCurrencyDisplay.innerHTML = "Currency: " + newEntry.currency;
    cardBody.appendChild(userStreamCurrencyDisplay);

    let userSubsDisplay = document.createElement('p');
    userSubsDisplay.className = "card-text inner-p";
    userSubsDisplay.innerHTML = "Subs: " + newEntry.subs;
    cardBody.appendChild(userSubsDisplay);

    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'row';
    cardBody.appendChild(buttonDiv);

    let editButton = document.createElement('button');
    editButton.className = "btn btn-warning btn-sm col";
    editButton.innerHTML = "EDIT";
    editButton.onclick = () => {editTicket(newEntry.name)};
    buttonDiv.appendChild(editButton);

    let deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-danger btn-sm col";
    deleteButton.innerHTML = "DELETE";
    deleteButton.onclick = () => {deleteTicket(newEntry.name)};
    buttonDiv.appendChild(deleteButton);

    document.getElementById("indivEntries").appendChild(newEntryCard);

    appendToEntryList(newEntry.name)
  }
}

function editUserCard(updatedEntry){
  let card = document.getElementById("userCard" + updatedEntry.name);
  card.getElementsByTagName('h6')[0].innerHTML = "Tickets: " + updatedEntry.tickets;
  let otherAttr = card.getElementsByTagName('p')
  otherAttr[0].innerHTML = `Initial Tickets: ${updatedEntry.initTickets}`
  otherAttr[1].innerHTML = "$ " + updatedEntry.dollar;
  otherAttr[2].innerHTML = "Bits: " + updatedEntry.bits;
  otherAttr[3].innerHTML = "Currency: " + updatedEntry.currency;
  otherAttr[4].innerHTML = "Subs: " + updatedEntry.subs;
}

function editTicket(name){
  document.getElementById("userName").value = name;
  document.getElementById("userName").disabled = true;
  document.getElementById("userInitialTickets").value = userEntries[name].initTickets;
  document.getElementById("userDollar").value = userEntries[name].dollar;
  document.getElementById("userBits").value = userEntries[name].bits;
  document.getElementById("userCurrency").value = userEntries[name].currency;
  document.getElementById("userSubs").value = userEntries[name].subs;
}

function deleteTicket(name){
  delete userEntries[name];
  delete localStorage[name];
  let removeTicket = document.getElementById("userCard" + name);
  removeTicket.remove();
  let allEntryOptions = entryList.childNodes
  let entryToRemove;
  allEntryOptions.forEach((x) => {
    if(x.value == name)
      entryToRemove = x;
  })
  entryToRemove.remove();
  --entries;
  if(entries == 0) document.getElementById("entries").style.display = "none";
}

function drawWinner(){
  let raffleTickets = []
  let ticketCount = 0;
  let userTickets;
  for(user in userEntries) {
    userTickets = userEntries[user].tickets;
    ticketCount += userTickets;
    for(let i = 0; i < userTickets; ++i)
      raffleTickets.push(user); 
  }
  let winningTicket = Math.floor(Math.random() * ticketCount);
  let winner = raffleTickets[winningTicket];

  displayWinner(ticketCount, winningTicket, winner)
}

let firstDrawing = true;
function displayWinner(tickets, winTicketNumber, winner){
  scrollToTop();

  // create winners display
  if(firstDrawing){
    firstDrawing = false;
    let topJumbo = document.getElementById("top-header");
    while(topJumbo.firstChild){
      topJumbo.removeChild(topJumbo.firstChild)
    }
    topJumbo.style.height = "100vh";

    let newHeading = document.createElement("h2")
    newHeading.className = "display-4 heading"
    newHeading.innerHTML = "Time To Draw Winners!"
    topJumbo.appendChild(newHeading)

    let hr = document.createElement('hr')
    hr.className = "my-4"
    topJumbo.appendChild(hr)

    // create winner display main area
    let newRow = document.createElement("div")
    newRow.className = "row"

    let leftCol = document.createElement("div")
    leftCol.className = "col"
    newRow.appendChild(leftCol)

    let rightCol = document.createElement("div")
    rightCol.className = "col"
    newRow.appendChild(rightCol)

    // set up left side column
    let totalTicketsh4 = document.createElement("h4")
    totalTicketsh4.id = "totalTicketDisplayTitle"
    totalTicketsh4.innerHTML = "Total Tickets: "

    let totalTicketsSpan = document.createElement("span")
    totalTicketsSpan.id = "totalTickets"

    totalTicketsh4.appendChild(totalTicketsSpan)
    leftCol.appendChild(totalTicketsh4)

    // set up winners table
    let winnersTable = document.createElement("table")
    winnersTable.className = "table"
    winnersTable.id = "winnersTable"
    let thead = document.createElement("thead")
    thead.id = "theadID"
    winnersTable.appendChild(thead)
    let th = document.createElement("th")
    th.scope = "col"
    th.innerHTML = "Current Winners"
    let winnerCountSpan = document.createElement("span")
    winnerCountSpan.id = "winnerCountSpan"
    th.appendChild(winnerCountSpan)
    thead.appendChild(th)
    let tbody = document.createElement("tbody")
    tbody.id = "winnersTableBody"
    winnersTable.appendChild(tbody)
    leftCol.appendChild(winnersTable)

    // build right side winners and functions
    let drawwinnerBtn = document.createElement("button")
    drawwinnerBtn.className = "btn btn-success btn-lg btn-block"
    drawwinnerBtn.onclick = () => { drawWinner() }
    drawwinnerBtn.innerText = "Draw Another Winner"
    rightCol.appendChild(drawwinnerBtn)

    let winnerDiv = document.createElement("div")
    winnerDiv.id = "winnerDiv"
    winnerDiv.style.display = "none"

    let winnerh4 = document.createElement("h4")
    winnerh4.className = "heading"
    winnerh4.innerHTML = "Winner: "
    winnerh4.id = "winnerh4"
    let winnerSpan = document.createElement("span")
    winnerSpan.className = "badge badge-danger"
    winnerSpan.id = "winnerSpan"
    winnerh4.appendChild(winnerSpan)
    winnerDiv.appendChild(winnerh4)

    //fun stuff
    let emote = document.createElement("img")
    emote.id = "emote";
    winnerh4.appendChild(emote)

    let acceptBtn = document.createElement("buttom")
    acceptBtn.className = "btn btn-success btn-lg btn-block"
    acceptBtn.id = "acceptBtnID"
    acceptBtn.onclick = () => { acceptWinner() }
    acceptBtn.innerHTML = "Accept Winner"
    winnerDiv.appendChild(acceptBtn)

    rightCol.appendChild(winnerDiv)

    // only append full display once done
    topJumbo.appendChild(newRow)
  }
  
  document.getElementById("totalTickets").innerHTML = tickets;

  document.getElementById("winnerDiv").style.display = "block"

  document.getElementById("winnerSpan").innerHTML = winner

  document.getElementById("emote").src = randEmote()
}

let emotes = [30259, 41, 88, 425618, 25, 112291, 160402, 112292, 81274, 1470035, 160394]

const selectCasterBtn = document.getElementById("selectCasterBtn")
const inputStreamer = document.getElementById("inputStreamer")
const clearCasterBtn = document.getElementById("clearCasterBtn")

selectCasterBtn.addEventListener('click', setEmotesClick)
clearCasterBtn.addEventListener('click', resetEmoteInput)
function setEmotesClick(){
  setEmotesByChannel(inputStreamer.value)
  clearCasterBtn.style.visibility = "visible"
  inputStreamer.disabled = true;
}

function resetEmoteInput(){
  inputStreamer.disabled = false;
  clearCasterBtn.style.visibility = "hidden"
  inputStreamer.value = ''
  setEmotesByChannel(inputStreamer.value)
}

function setEmotesByChannel(name){
  name = name.toLowerCase()
  switch(name){
    case 'thabuttress':
      emotes = [1626622, 1626511, 1626621, 1783065, 555417, 1466673, 1096390, 275711, 169977, 1160739, 169993, 1871188, 1626510, 192380, 423878, 444571]
      break;
    case 'nagisake':
      emotes = [719343, 131518, 719269, 128517, 128028, 131521, 732794, 770900, 127711, 128085, 732796, 208031]
      break;
    case 'lunalyrik':
      emotes = [1757188, 1757191, 1335645, 1335649, 1335647, 1788024, 1253788, 1452423, 789948, 1266781, 1779181, 1452427, 1249941, 1249940, 1760238, 1308996, 1675156, 1263821, 1319425]
      break;
    default:
      emotes = [30259, 41, 88, 425618, 25, 112291, 160402, 112292, 81274, 1470035, 160394]
  }
}

function randEmote(){
  let position = Math.floor(Math.random() * emotes.length)

  return "https://static-cdn.jtvnw.net/emoticons/v1/" + emotes[position] + "/2.0"
}

let winners = []
function acceptWinner(){
  if(!winners.length){
    let downloadWinnerBtn = document.createElement("button")
    downloadWinnerBtn.className = "btn btn-primary btn-lg float-right"
    downloadWinnerBtn.innerHTML = "Download Winners"
    downloadWinnerBtn.onclick = () => { downloadWinners() }
    document.getElementById("totalTicketDisplayTitle").appendChild(downloadWinnerBtn)
  }

  let winner = document.getElementById("winnerSpan").innerHTML
  winners.push(winner)

  document.getElementById("winnerCountSpan").innerHTML = ": " + winners.length

  --document.getElementById("totalTickets").innerHTML

  --userEntries[winner].tickets 
  editUserCard(userEntries[winner])

  let winnerTR = document.createElement("tr")
  let winnerEmoteSpan = document.createElement("span")
  let winnerEmote = document.createElement('img')
  winnerEmoteSpan.className = "emoteClass"
  winnerEmote.src = document.getElementById("emote").src.replace("2.0", "1.0")
  winnerEmoteSpan.appendChild(winnerEmote)

  let winnerNameTD = document.createElement("td")
  winnerNameTD.appendChild(winnerEmoteSpan)
  winnerNameTD.innerHTML += winner
  winnerTR.appendChild(winnerNameTD)
  let tableBody = document.getElementById("winnersTableBody")
  tableBody.insertBefore(winnerTR, tableBody.childNodes[0])

  document.getElementById("winnerDiv").style.display = "none"
  if(winners.length > 8){
    let topJumbo = document.getElementById("top-header");
    let topJumboSize = Number(topJumbo.style.height.replace("vh", "")) + 7.5
    topJumbo.style.height = + topJumboSize + "vh"
  }
}

function downloadWinners(){
  let element = document.createElement('a')

  let newCSV = formatToWinnerCSV(winners)
  element.setAttribute('href', 'data:text/csv;charset=usf-8,' + encodeURIComponent(newCSV))
  element.setAttribute('download', 'winners.csv')
  
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function formatToWinnerCSV(winnersArray){
  let csv = "name," + "\r\n"

  for(i in winnersArray){
    csv += winnersArray[i] + "," + "\r\n"
  }

  return csv
}

function download(){
  let element = document.createElement('a')

  let newCSV = formatToCSV(userEntries)
  element.setAttribute('href', 'data:text/csv;charset=usf-8,' + encodeURIComponent(newCSV))
  element.setAttribute('download', 'raffle_info.csv')
  
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function formatToCSV(jsonUsersArray){
  let csv = "name,dollars,bits,currency,subs,initTickets,tickets" + "\r\n"

  for(user in jsonUsersArray){
    csv += jsonUsersArray[user].name + ","
    csv += jsonUsersArray[user].dollar + ","
    csv += jsonUsersArray[user].bits + ","
    csv += jsonUsersArray[user].currency + ","
    csv += jsonUsersArray[user].subs + ","
    csv += jsonUsersArray[user].initTickets + ","
    csv += jsonUsersArray[user].tickets + ","
    csv += "\r\n"
  }

  return csv
}

function upload(){
  let fileInput = document.getElementById("uploadedCSV")
  fileInput.click()
}

function handleFiles(){
  let newCSV = document.getElementById("uploadedCSV").files[0];
  let fileType = newCSV.name.split('.')[1].toLowerCase()
  if(fileType == "csv"){
    let reader = new FileReader();
    reader.readAsText(newCSV);
    reader.addEventListener("load", () => {
      updateWithNewCSV(reader.result)
      document.getElementById("uploadedCSV").value = ""
    })
  }
}

function updateWithNewCSV(newCSV){
  let csvArray = newCSV.split('\r\n')
  let csvTitleArray = csvArray[0].split(',')
  csvArray.shift();

  for(item in csvArray){
    if(csvArray[item] != ""){
      let userArray = csvArray[item].split(',')
      let csvUser = {}

      for(column in csvTitleArray){
        csvUser[csvTitleArray[column].toLowerCase()] = userArray[column]
      }

      console.log(csvUser)

      let newEntry = addEntry(csvUser.name,
        Number(csvUser.dollars) || Number(csvUser.cash.replace("$","")),
        Number(csvUser.bits), Number(csvUser.currency), Number(csvUser.subs), Number(csvUser.inittickets))
      displayEntry(newEntry)
      
      appendToEntryList(newEntry.name)
      if(entries == 1){
        scrollToBottom()
        document.getElementById("entries").style.display = "block"
      }
    }
  }
}

function resetItems(){
  
  let rateInputs = document.getElementsByClassName('rate-input')
  for(let i in rateInputs)
    rateInputs[i].value = "";

  for(user in userEntries)
    deleteTicket(user)

  ticketRates = {
    'dollar': "NA",
    'bits': "NA",
    'stream currency': "NA",
    'subs': "NA"
  }

  setRates();

  try{
    document.getElementById('winnerDisplay').innerHTML = "";
  }
  catch(err){
    console.log(err)
  }
  
  let hideDivs = document.getElementsByClassName('start-hidden')
  Array.prototype.forEach.call(hideDivs, (div) => {
    div.style.display = "none";
  })
  localStorage.clear();
  entries = 0;
}

window.addEventListener('keypress', (e) => {
  let key = e.which || e.keyCode;
  if(key === 13){
    if(document.activeElement.className == "form-control rate-input")
      setRates()
    else if(document.activeElement.className == "form-control user-input")
      submitEntry()
  }
});

// checking local hosts with and updating values
(function() {
  let keys = Object.keys(localStorage);

  if(keys.includes("ticketRates")){
    let localSavedRates = JSON.parse(localStorage["ticketRates"])
    // set local rates from the local storage
    if(localSavedRates.dollar != "NA" ||
      localSavedRates.bits != "NA" ||
      localSavedRates["stream currency"] != "NA"){
        document.getElementById('dollarRate').value = (localSavedRates.dollar == "NA") ? "" : localSavedRates.dollar;
        document.getElementById('bitsRate').value = (localSavedRates.bits == "NA") ? "" : localSavedRates.bits;
        document.getElementById('sCRate').value = (localSavedRates["stream currency"] == "NA") ? "" : localSavedRates["stream currency"];
        document.getElementById('subRate').value = (localSavedRates.subs == "NA") ? "" : localSavedRates.subs;
        setRates();
    }
  }

  Object.keys(localStorage).forEach((key) => {
    if(key == "ticketRates"){
      let localSavedRates = JSON.parse(localStorage[key])
      // set local rates from the local storage
      if(localSavedRates.dollar != "NA" ||
        localSavedRates.bits != "NA" ||
        localSavedRates["stream currency"] != "NA"){
          document.getElementById('dollarRate').value = (localSavedRates.dollar == "NA") ? "" : localSavedRates.dollar;
          document.getElementById('bitsRate').value = (localSavedRates.bits == "NA") ? "" : localSavedRates.bits;
          document.getElementById('sCRate').value = (localSavedRates["stream currency"] == "NA") ? "" : localSavedRates["stream currency"];
          document.getElementById('subRate').value = (localSavedRates.subs == "NA") ? "" : localSavedRates.subs;
          setRates();
        }
    }
    else{
      let localSavedUser = JSON.parse(localStorage[key])
      console.log(localSavedUser)
      document.getElementById('entries').style.display = "block";
      userEntries[key] = localSavedUser;
      displayEntry(localSavedUser)
      if(entries == 1) {
        document.getElementById('downloadBtn').disabled = false;
        scrollToBottom();
      }
      appendToEntryList(key)
    }
  })
})();

function appendToEntryList(name){
  const entryList = document.getElementById("entryList")
  let currentOptions = entryList.childNodes
  let optionsValues = []
  currentOptions.forEach((x) => {
    optionsValues.push(x.value)
  })
  if(!optionsValues.includes(name)){
    let newOption = document.createElement("option")
    newOption.value = name
    entryList.appendChild(newOption)
  }
}

const userNameInput = document.getElementById("userName")
const entryList = document.getElementById("entryList")
userNameInput.addEventListener("change", checkIfAlreadyEntered)

function checkIfAlreadyEntered(){
  let name = userNameInput.value.toUpperCase().trim()
  if(userEntries.hasOwnProperty(name)){
    editTicket(name)
    userNameInput.disabled = false;
  }
  else
    clearUserInputs()
}

$('#myModal').on('shown.bs.modal', function () {
  console.log("click")
  $('#myModal').trigger('focus')
})

// Make sure Service Workers are Supported
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw_cached_pages.js')
      .then(reg => console.log('Service Worker: Registered (Pages)'))
      .catch(err => console.log(`Service Worker: Error: ${err}`))
  });
}