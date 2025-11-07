import './style.css'

import axios from 'axios'
import { generateMainNav } from './components/header.js';

const apiUrl = "https://livejs-api.hexschool.io/api/livejs/v1";
const api = "jsweek9api";
let tempProducts = [];
let tempCarts = [];

const getProducts = async () => {
  try {
		const res = await axios.get(`${apiUrl}/customer/${api}/products`);
    tempProducts = [...res.data.products];
		console.log(tempProducts);
	} catch (error) {
		console.log(error);
	}

  let tempHTML = '';
  tempProducts.forEach(item => {
    const formattedPrice = item.price.toLocaleString("en-US");
		const formattedOriginPrice = item.origin_price.toLocaleString("en-US");
    tempHTML += `<li class="group hover:coursor-pointer">
                  <div class="relative mb-3">
                    <span class="z-10 px-4 md:px-6 py-2 text-sm md:text-xl absolute end-0 top-5 bg-black block text-white">新品</span>
                    <div class="max-h-[330px] leading-0 overflow-hidden">
                      <img src="${item.images}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out" alt="${item.title}">
                    </div>
                    <button type="button" class="addItem p-3 text-xl text-center w-full cursor-pointer bg-black group-hover:bg-accent text-white transition-colors duration-300 ease-in-out" data-id="${item.id}">加入購物車</button>
                  </div>
                  <div>
                    <p class="mb-2 text-lg lg:text-xl">${item.title}</p>
                    <div class="flex flex-col">
                      <span class="block leading-normal text-sm lg:text-xl"><del>NT$${formattedOriginPrice}</del></span>
                      <span class="block leading-normal text-lg lg:text-2xl">NT$${formattedPrice}</span>
                    </div>
                  </div>
                </li>`;
  })
  document.querySelector("#productList").innerHTML = tempHTML

  const addItemBtns = document.querySelectorAll(".addItem");
  addItemBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      addCartsItem(id);
    })
  })
}

const deleteAllBtn = document.querySelector("#deleteAll");
if (deleteAllBtn) {
	deleteAllBtn.addEventListener("click", async () => {
		try {
			await axios.delete(`${apiUrl}/customer/${api}/carts`);
			getCharts(); 
		} catch (error) {
			console.log(error);
		}
	});
}

const getCharts = async () => {
	try {
		const res = await axios.get(`${apiUrl}/customer/${api}/carts`);
		tempCarts = [...res.data.carts];
		console.log(tempCarts);
	} catch (error) {
		console.log(error);
	}

	// 確保表格結構存在（如果被意外移除）
	if (!document.querySelector("#cartList")) {
		document.querySelector("#cartArea").innerHTML = `
      <table>
        <thead>
          <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>
        </thead>
        <tbody id="cartList"></tbody>
        <tfoot>
          <tr>
            <td>
              <button type="button" id="deleteAll" class="py-2 px-3 border border-primary-500 rounded-sm text-primary cursor-pointer transition-all hover:bg-alert hover:text-white hover:border-alert">刪除所有品項</button>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額:</p>
            </td>
            <td>NT$<span id="totalAmout"></span></td>
          </tr>
        </tfoot>
      </table>
    `;
	}

	const cartListEl = document.querySelector("#cartList");
	if (tempCarts.length == 0) {
		cartListEl.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-2xl">購物車沒有東西</td></tr>';
		document.querySelector("#totalAmout").innerHTML = "0";
		return;
	}

	let tempHTML = "";
	let totalAmount = 0;

	tempCarts.forEach((item) => {
		const formattedPrice = item.product.price.toLocaleString("en-US");
		const itemTotalPrice = item.product.price * item.quantity;
		const formattedItemTotalPrice = itemTotalPrice.toLocaleString("en-US");
		totalAmount += itemTotalPrice;
		tempHTML += `<tr>
                  <td>
                    <div class="flex items-center gap-5">
                      <div class="w-21 h-21"><img src="${item.product.images}" alt="${item.product.title}" class="h-full w-full object-cover" /></div>
                      <p>${item.product.title}</p>
                    </div>
                  </td>
                  <td>NT$${formattedPrice}</td>
                  <td>${item.quantity}</td>
                  <td>NT$${formattedItemTotalPrice}</td>
                  <td class="discardBtn">
                    <button data-cart-id="${item.id}" class="deleteItem border border-primary-500 font-bold text-lg px-3 py-1 cursor-pointer rounded-md transition-all hover:bg-accent hover:text-white hover:border-accent">X</button>
                  </td>
                </tr>`;
	});

	cartListEl.innerHTML = tempHTML;
	document.querySelector("#totalAmout").innerHTML = totalAmount.toLocaleString("en-US");

	const deleteBtns = document.querySelectorAll(".deleteItem");
	deleteBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			const id = btn.getAttribute("data-cart-id");
			deleteCartsItem(id);
		});
	});
};

const addCartsItem = async (productId, quantity = 1) => {
	const objData = {
		data: {
			productId,
      quantity
		},
	};
	try {
		const res = await axios.post(`${apiUrl}/customer/${api}/carts`, objData );
    console.log(res.data)
		getCharts();
	} catch (error) {
		console.log(error);
	}
};

const deleteCartsItem = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/customer/${api}/carts/${id}`);
    console.log(res.data);
    getCharts();
  } catch (error) {
    console.log(error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  generateMainNav();
  getProducts();
  getCharts()

})

