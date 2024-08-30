import countryList from "./countryList";

const quantity = document.querySelector("#quantity") as HTMLInputElement;
const dn_btn = document.querySelector("#dn_btn");
const in_btn = document.querySelector("#in_btn");

// this function work for the + and - button
// function started from here
function quantityUpdate(change: number) {
  const current = Number(quantity.value || "0");
  const newValue = Math.max(0, current + change);
  quantity.value = String(newValue);
}

in_btn?.addEventListener("click", () => quantityUpdate(1));
dn_btn?.addEventListener("click", () => quantityUpdate(-1));
// function end here of + and - button function.

const LeftSer = document.querySelector("#LeftCur") as HTMLInputElement;
const ReftSer = document.querySelector("#ReftCur") as HTMLInputElement;

const leftSelectCountry = document.querySelector(
  "#left-select-country"
) as HTMLSelectElement;
const rightSelectCountry = document.querySelector(
  "#right-select-country"
) as HTMLSelectElement;

const leftCountryName = document.querySelector(
  "#Lcountry-name"
) as HTMLHeadingElement;
const rightCountryName = document.querySelector(
  "#Rcountry-name"
) as HTMLHeadingElement;

const lFlag = document.querySelector("#l-flag") as HTMLImageElement;
const rFlag = document.querySelector("#r-flag") as HTMLImageElement;
const lHideText = document.querySelector("#l-hide-text") as HTMLElement;
const rHideText = document.querySelector("#r-hide-text") as HTMLElement;

let currencyCode;

// this function work for the search box.
// search box function started from here
function setupSearch(
  input: HTMLInputElement,
  label: HTMLElement,
  noMatchText: HTMLElement,
  flag: HTMLImageElement,
  isFrom: boolean,
  selectedCountry: HTMLSelectElement
) {
  let q = "";
  let match = "";

  input.addEventListener("input", () => {
    q = input.value.trim().toUpperCase();
    match = Object.keys(countryList).find((code) => code.includes(q)) || "";

    if (match) {
      const country = countryList[match];
      label.textContent = `${match} (${country})`;
      flag.src = `https://flagsapi.com/${country}/flat/64.png`;
      label.classList.remove("hidden");
      noMatchText.classList.add("hidden");
    } else if (q.length >= 2) {
      label.classList.add("hidden");
      noMatchText.classList.remove("hidden");
    }
  });

  input.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter" && q.length === 3 && match) {
      let optionExists = Array.from(selectedCountry.options).some(
        (opt) => opt.value === match
      );

      if (!optionExists) {
        const newOption = document.createElement("option");
        newOption.value = match;
        newOption.textContent = `${match} (${countryList[match]})`;
        selectedCountry.appendChild(newOption);
      }

      selectedCountry.value = match;

      if (isFrom) {
        fromCurrency = match;
      } else {
        toCurrency = match;
      }
    }
  });
}

setupSearch(
  LeftSer,
  leftCountryName,
  lHideText,
  lFlag,
  true,
  leftSelectCountry
);
setupSearch(
  ReftSer,
  rightCountryName,
  rHideText,
  rFlag,
  false,
  rightSelectCountry
);
// search function end here

function addOptions(
  selectElement: HTMLSelectElement,
  labelElement: HTMLElement,
  image: HTMLImageElement,
  serchBox: HTMLInputElement,
  noMatchText: HTMLElement,
  isFrom: Boolean
) {
  for (const [currencyCode, countryCode] of Object.entries(countryList)) {
    const newOption = document.createElement("option");
    newOption.value = countryCode;
    newOption.text = currencyCode;
    selectElement.appendChild(newOption);
  }

  selectElement.addEventListener("click", () => {
    serchBox.value = "";
  });
  selectElement.addEventListener("change", () => {
    const reversedMap = Object.fromEntries(
      Object.entries(countryList).map(([currency, country]) => [
        country,
        currency,
      ])
    );

    const selectedCode = selectElement.value;
    currencyCode = reversedMap[selectedCode];

    if (selectedCode) {
      image.src = `https://flagsapi.com/${selectElement.value}/flat/64.png`;
      labelElement.innerHTML = `${currencyCode} (${selectedCode})`;
      labelElement.classList.remove("hidden");
      noMatchText.classList.add("hidden");

      if (isFrom) {
        fromCurrency = currencyCode;
      } else {
        toCurrency = currencyCode;
      }
    }
  });
}

addOptions(leftSelectCountry, leftCountryName, lFlag, LeftSer, lHideText, true);
addOptions(
  rightSelectCountry,
  rightCountryName,
  rFlag,
  ReftSer,
  rHideText,
  false
);

let fromCurrency: string;
let toCurrency: string;

const BAS_URL = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";
const convertBtn = document.querySelector("#convert-btn");
const exchangeRate = document.getElementById("exchange-rate") as HTMLElement;

function exhangingrate() {
  convertBtn?.addEventListener("click", () => {

    fetch(BAS_URL)
      .then((res) => res.json())
      .then((data) => {
        const eurRate = data.eur;
        const exRate =
          eurRate[toCurrency.toLocaleLowerCase()] /
          eurRate[fromCurrency.toLocaleLowerCase()];
        exchangeRate.innerHTML = String(
          (exRate * Number(quantity.value.trim())).toFixed(3)
        );
        exchangeRate.style.cssText = `
  font-size: 24px;
  font-weight: bold;
`;
      })
      .catch(() => {
        exchangeRate.innerHTML = "Failed to get exchange rate.";
        exchangeRate.style.cssText = `
  font-size: 12px;
  color: red;
  font-weight: bold;
`;
      });
  });
}

exhangingrate();
