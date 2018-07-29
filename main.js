let ticketRates = {
  'dollar': "NA",
  'bits': "NA",
  'stream currency': "NA"
}

function setRates(){
  ticketRates.dollar = document.getElementById("dollarRate").value || "NA"
  ticketRates.bits = document.getElementById("bitsRate").value || "NA"
  ticketRates["stream currency"] = document.getElementById("sCRate").value || "NA"
  displayRates()
  let numEntries = 0;
  for(users in userEntries)
    ++numEntries;
  if(numEntries > 0)
    recalcEntries();
}

function displayRates(){
  document.getElementById("displayDollarRate").innerHTML = ticketRates.dollar
  document.getElementById("displayBitsRate").innerHTML = ticketRates.bits
  document.getElementById("displayStreamCurrencyRate").innerHTML = ticketRates["stream currency"]
  document.getElementById("displayRates").style.display = "block"
  document.getElementById("addEntry").style.display = "block"
}

function recalcEntries(){
  for(user in userEntries){
    addEntry(userEntries[user].name, 
      userEntries[user].dollar, userEntries[user].bits, userEntries[user].currency)
    displayEntry(userEntries[user])
  }
}

// grab data, add to array of objects, make card, display draw winner area
function submitEntry(){
  let name = document.getElementById("userName").value;
  let dollar = document.getElementById("userDollar").value;
  let bits = document.getElementById("userBits").value;
  let currency = document.getElementById("userCurrency").value;
  document.getElementById("userName").disabled = false;
  // make sure username is available before adding entries
  if(name != ""){
    // add values to userEntries array
    let newEntry = addEntry(name, dollar, bits, currency)
    // display new Entry
    displayEntry(newEntry);

    // clear ticket inputs
    document.getElementById("userName").value = "";
    document.getElementById("userDollar").value = "";
    document.getElementById("userBits").value = "";
    document.getElementById("userCurrency").value = "";
    
    if(document.getElementById("entries").style.display != "block") {
      document.getElementById("entries").style.display = "block"
    }
  } 
  else{
    document.getElementById("userName").focus();
  }
}

// array of all users currenty entered
let userEntries = {}
function addEntry(name, dollar, bits, currency) {
  name = name.toLowerCase()

  let newEntry = {
    "name": name,
    "dollar": dollar,
    "bits": bits,
    "currency": currency,
    "tickets":0
  }
  newEntry.tickets = ticketCalc(dollar, bits, currency)

  userEntries[name] = newEntry

  return newEntry
}

// will round down values so fractions do not count
function ticketCalc(dollar, bits, currency){
  let tickets = 0;

  tickets += (ticketRates.dollar == "NA") ? 
    0 : Math.floor(dollar/ticketRates.dollar)
  tickets += (ticketRates.bits == "NA") ? 
    0 : Math.floor(bits/ticketRates.bits)
  tickets += (ticketRates["stream currency"] == "NA") ? 
    0 : Math.floor(currency/ticketRates["stream currency"])

  return tickets;
}

function displayEntry(newEntry){

  if(document.getElementById("userCard" + newEntry.name)){
    editUserCard(newEntry)
  }
  else{
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
    usersTickets.innerHTML = "Tickets: " + newEntry.tickets;
    cardBody.appendChild(usersTickets);

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
  }
}

function editUserCard(updatedEntry){
  let card = document.getElementById("userCard" + updatedEntry.name);
  card.getElementsByTagName('h6')[0].innerHTML = "Tickets: " + updatedEntry.tickets;
  let otherAttr = card.getElementsByTagName('p')
  otherAttr[0].innerHTML = "$ " + updatedEntry.dollar;
  otherAttr[1].innerHTML = "Bits: " + updatedEntry.bits;
  otherAttr[2].innerHTML = "Currency: " + updatedEntry.currency;
}

function editTicket(name){
  document.getElementById("userName").value = name;
  document.getElementById("userName").disabled = true;
  document.getElementById("userDollar").value = userEntries[name].dollar;
  document.getElementById("userBits").value = userEntries[name].bits;
  document.getElementById("userCurrency").value = userEntries[name].currency;
}

function deleteTicket(name){
  delete userEntries[name];
  let removeTicket = document.getElementById("userCard" + name);
  removeTicket.remove();
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
  console.log(winningTicket);
  document.getElementById("winnerDisplay").innerHTML = raffleTickets[winningTicket];
}