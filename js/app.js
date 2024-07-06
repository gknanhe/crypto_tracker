const shimmerContainer = document.querySelector(".shimmer-container");
const paginationContainer = document.getElementById("pagination");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const sortVolumeAsc = document.getElementById("sort-volume-asc");
const sortVolumeDesc = document.getElementById("sort-volume-desc");
const searchBox = document.getElementById("search-box");

const url =
  "https://coingecko.p.rapidapi.com/coins/markets?page=1&vs_currency=usd&per_page=100&order=market_cap_desc";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-rapidapi-key": "a4e7eef2f1msh179f2020ecba7f2p1c0c32jsn8010e4d882ef",
  },
};

let coins = [];
const itemsPerPage = 15;
let current_page = 1;

//fetching the data from api

const fetchCoins = async () => {
  try {
    const response = await fetch(url, options);
    const coinsData = await response.json();
    return coinsData;
  } catch (error) {
    console.error("Error while fetching", error);
  }
};

const fetchFavouriteCoins = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

const saveFavouriteCoins = (favourites) => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

const handleFavClick = (coinId) => {
  let favourites = fetchFavouriteCoins();
  // if coinId is already present in favs, then remove it
  if (favourites.includes(coinId)) {
    favourites = favourites.filter((id) => id !== coinId);
    saveFavouriteCoins(favourites);
  } else {
    // save the coin id
    favourites.push(coinId);
    saveFavouriteCoins(favourites);
  }
  displayCoins(getCoinsToDisplay(coins, current_page));
};

//sort
const sortCoinsByPrice = (order) => {
  if (order === "asc") {
    coins.sort((a, b) => a.current_price - b.current_price);
  } else if (order === "desc") {
    coins.sort((a, b) => b.current_price - a.current_price);
  }
  current_page = 1;
  displayCoins(getCoinsToDisplay(coins, current_page));
  renderPagination(coins);
};

sortPriceAsc.addEventListener("click", () => {
  sortCoinsByPrice("asc");
});

sortPriceDesc.addEventListener("click", () => {
  sortCoinsByPrice("desc");
});

const sortCoinsByVolume = (order) => {
  if (order === "asc") {
    coins.sort((a, b) => a.total_volume - b.total_volume);
  } else if (order === "desc") {
    coins.sort((a, b) => b.total_volume - a.total_volume);
  }
  current_page = 1;
  displayCoins(getCoinsToDisplay(coins, current_page));
  renderPagination(coins);
};

sortVolumeAsc.addEventListener("click", () => {
  sortCoinsByVolume("asc");
});

sortVolumeDesc.addEventListener("click", () => {
  sortCoinsByVolume("desc");
});

// search

const handleSearch = () => {
  const searchQuery = searchBox.value.trim();
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  current_page = 1;
  displayCoins(getCoinsToDisplay(filteredCoins, current_page));
  renderPagination(filteredCoins);
};

searchBox.addEventListener("input", handleSearch);

const showShimmer = () => {
  shimmerContainer.style.display = "flex";
};

const hideShimmer = () => {
  shimmerContainer.style.display = "none";
};

const getCoinsToDisplay = (coins, page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return coins.slice(start, end);
};

const renderPagination = (coins) => {
  const totalPages = Math.ceil(coins.length / itemsPerPage);
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    //create btns of total pages length
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-button");
    if (i === current_page) {
      pageBtn.classList.add("active");
    }
    //allow click over the button

    pageBtn.addEventListener("click", () => {
      current_page = i;
      displayCoins(getCoinsToDisplay(coins, current_page));
      updatePaginationButtons();
    });

    const updatePaginationButtons = () => {
      const pageBtns = document.querySelectorAll(".page-button");
      pageBtns.forEach((button, index) => {
        if (index + 1 === current_page) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });
    };

    paginationContainer.appendChild(pageBtn);
  }
};
//display the data on the page

const displayCoins = (coins) => {
  const favourites = fetchFavouriteCoins();

  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = "";
  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    const isFavourite = favourites.includes(coin.id) ? "favorite" : "";
    row.innerHTML = `
            <td>${(current_page - 1) * itemsPerPage + index + 1}</td>
            <td>
              <img
                src="${coin.image}"
                alt="${coin.name}"
                width="24"
                height="24"
              />
            </td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td><i class="fa-solid fa-star favorite-icon ${isFavourite}" data-id="${
      coin.id
    }" ></i></td>
        `;

    row.addEventListener("click", () => {
      window.open(`coin/coin.html?id=${coin.id}`, "_blank");
    });

    row.querySelector(".favorite-icon").addEventListener("click", (event) => {
      event.stopPropagation();
      handleFavClick(coin.id);
    });

    tableBody.appendChild(row);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimmer();
    coins = await fetchCoins();
    displayCoins(getCoinsToDisplay(coins, current_page));
    renderPagination(coins);
    hideShimmer();
  } catch (error) {
    console.log(error);
    hideShimmer();
  }
});
