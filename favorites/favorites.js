const shimmerContainer = document.querySelector(".shimmer-container");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-QfHrmtcRHf95GvkxaemKegTr",
  },
};

const getFavouriteCoins = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

//fetching the data from api

const fetchFavouriteCoins = async (coinIds) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
        ","
      )}`,
      options
    );
    const coinsData = await response.json();
    return coinsData;
  } catch (error) {
    console.error("Error while fetching", error);
  }
};

//shimmer
const showShimmer = () => {
  shimmerContainer.style.display = "flex";
};

const hideShimmer = () => {
  shimmerContainer.style.display = "none";
};

const displayFavoriteCoins = (favCoins) => {
  const noFavMsg = document.getElementById("no-favorites");

  if (favCoins.length === 0) {
    noFavMsg.style.display = "block";
  }

  const tableBody = document.getElementById("favorite-table-body");
  tableBody.innerHTML = "";
  favCoins.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${index + 1}</td>
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
    `;
    tableBody.appendChild(row);

    row.addEventListener("click", () => {
      window.open(`../coin/coin.html?id=${coin.id}`, "_blank");
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimmer();
    const favorites = getFavouriteCoins();
    if (favorites.length > 0) {
      const favoriteCoins = await fetchFavouriteCoins(favorites);
      displayFavoriteCoins(favoriteCoins);
    } else {
      displayFavoriteCoins([]);
    }
    hideShimmer();
  } catch (error) {
    console.log(error);
    hideShimmer();
  }
});
