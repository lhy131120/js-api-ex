import "./style.css";

import axios from "axios";
import { generateMainNav } from "./components/header.js";

const apiUrl = "https://livejs-api.hexschool.io/api/livejs/v1";
const api = "jsweek9api";
let tempProducts = [];
let tempCarts = [];
let tempOrders = [];
const token = "1yHPMFbDY6Wb1mQaaZnTPsRgGyM2";

const getProducts = async () => {
	try {
		const res = await axios.get(`${apiUrl}/customer/${api}/products`);
		tempProducts = [...res.data.products];
	} catch (error) {
		console.log(error);
	}

	let tempHTML = "";
	tempProducts.forEach((item) => {
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
	});
	if (document.querySelector("#productList")) document.querySelector("#productList").innerHTML = tempHTML;

	const addItemBtns = document.querySelectorAll(".addItem");
	addItemBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			const id = btn.getAttribute("data-id");
			addCartsItem(id);
		});
	});
};

const getCharts = async () => {
	try {
		const res = await axios.get(`${apiUrl}/customer/${api}/carts`);
		tempCarts = [...res.data.carts];
	} catch (error) {
		console.log(error);
	}

	// 確保表格結構存在（如果被意外移除）
	if (!document.querySelector("#cartList") && document.querySelector("#cartArea")) {
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
	if (tempCarts.length == 0 && cartListEl) {
		cartListEl.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-2xl">購物車沒有東西</td></tr>';
		document.querySelector("#totalAmout").innerHTML = "0";
		bindDeleteAllBtn();
		return;
	}

	let tempHTML = "";
	let totalAmount = 0;

	tempCarts.forEach((item) => {
		const formattedPrice = item.product.price.toLocaleString("en-US");
		const itemTotalPrice = item.product.price * item.quantity;
		const formattedItemTotalPrice = itemTotalPrice.toLocaleString("en-US");
		const currentQty = item.quantity;
		const minusDisabled = currentQty <= 1 ? "disabled" : "";
		const plusDisabled = currentQty >= 20 ? "disabled" : "";
		totalAmount += itemTotalPrice;
		tempHTML += `<tr>
                  <td>
                    <div class="flex items-center gap-5">
                      <div class="w-21 h-21"><img src="${item.product.images}" alt="${item.product.title}" class="h-full w-full object-cover" /></div>
                      <p>${item.product.title}</p>
                    </div>
                  </td>
                  <td>NT$${formattedPrice}</td>
                  <td>
                    <div class="flex items-center gap-3">
                      <button type="button" data-current-qty="${currentQty}" data-cart-id="${item.id}" data-edit="0" class="editItem w-10 h-10 flex items-center justify-center leading-0 border border-primary-500 font-bold text-lg px-3 py-1 cursor-pointer rounded-md transition-all hover:bg-accent hover:text-white hover:border-accent disabled:bg-alert disabled:cursor-not-allowed ${minusDisabled}"><span>-</span></button>
                      <div>${currentQty}</div>
                      <button type="button" data-current-qty="${currentQty}" data-cart-id="${item.id}" data-edit="1" class="editItem w-10 h-10 flex items-center justify-center leading-0 border border-primary-500 font-bold text-lg px-3 py-1 cursor-pointer rounded-md transition-all hover:bg-accent hover:text-white hover:border-accent disabled:bg-alert disabled:cursor-not-allowed ${plusDisabled}"><span>+</span></button>
                    </div>
                  </td>
                  <td>NT$${formattedItemTotalPrice}</td>
                  <td class="discardBtn">
                    <button type="button" data-cart-id="${item.id}" class="deleteItem w-10 h-10 text-center border border-primary-500 font-bold text-lg px-3 py-1 cursor-pointer rounded-md transition-all hover:bg-accent hover:text-white hover:border-accent">X</button>
                  </td>
                </tr>`;
	});

	if (cartListEl) cartListEl.innerHTML = tempHTML;
	if (document.querySelector("#totalAmout"))
		document.querySelector("#totalAmout").innerHTML = totalAmount.toLocaleString("en-US");

	const deleteBtns = document.querySelectorAll(".deleteItem");
	deleteBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			const id = btn.getAttribute("data-cart-id");
			deleteCartsItem(id);
		});
	});

	const editBtn = document.querySelectorAll(".editItem");
	editBtn.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			if (btn.disabled) return;

			const id = btn.getAttribute("data-cart-id");
			const type = btn.getAttribute("data-edit");
			const qty = parseInt(btn.getAttribute("data-current-qty"));

			// console.log(id, qty, type)
			if (isNaN(qty)) {
				console.error("Invalid quantity:", qty);
				return;
			}

			editItem(id, qty, type);
		});
	});

	bindDeleteAllBtn();
};

const bindDeleteAllBtn = () => {
	const deleteAllBtn = document.querySelector("#deleteAll");
	if (deleteAllBtn) {
		deleteAllBtn.removeEventListener("click", handleDeleteAll);
		deleteAllBtn.addEventListener("click", handleDeleteAll);
	}
};

const handleDeleteAll = async () => {
	try {
		await axios.delete(`${apiUrl}/customer/${api}/carts`);
		getCharts();
	} catch (error) {
		console.log(error);
	}
};

const addCartsItem = async (productId) => {
	console.log(productId);
	try {
		const res = await axios.get(`${apiUrl}/customer/${api}/carts`);
		const currentCarts = res.data.carts;
		const existingItem = currentCarts.find((cart) => cart.product.id === productId);

		let newQuantity = 1;
		existingItem ? (newQuantity = Math.min(existingItem.quantity + 1, 20)) : null;

		const objData = {
			data: {
				productId,
				quantity: newQuantity,
			},
		};

		const postRes = await axios.post(`${apiUrl}/customer/${api}/carts`, objData);
		getCharts();
	} catch (error) {
		console.log(error);
	}
};

const editItem = async (cartId, currentQty, editType) => {
	if (typeof currentQty !== "number" || isNaN(currentQty)) {
		console.error("currentQty must be a valid Number:", currentQty);
		return;
	}

	try {
		let newQuantity = editType === "0" ? currentQty - 1 : currentQty + 1;
		// if (newQuantity < 1 || newQuantity > 20) return;
		if (newQuantity > 20) {
			alert(`產品不能超過20`);
			return;
		}

		newQuantity < 1 ? deleteCartsItem(cartId) : null;

		const objData = {
			data: {
				id: cartId,
				quantity: newQuantity,
			},
		};
		const res = await axios.patch(`${apiUrl}/customer/${api}/carts`, objData);
		getCharts();
	} catch (error) {
		console.log(error.response.data.message);
	}
};

const deleteCartsItem = async (id) => {
	try {
		const res = await axios.delete(`${apiUrl}/customer/${api}/carts/${id}`);
		console.log(res.data);
		getCharts();
	} catch (error) {
		console.log(error);
	}
};

// Form Submit
const bindSubmitForm = () => {
	const submitBtn = document.getElementById("orderFormBtn");
	if (!submitBtn) return;

	submitBtn.addEventListener("click", async (e) => {
		e.preventDefault(); // 防止任何預設行為
		await submitOrder();
	});
};

const submitOrder = async () => {
	const form = document.getElementById("orderForm");
	const nameInput = document.getElementById("name");
	const telInput = document.getElementById("tel");
	const emailInput = document.getElementById("mail");
	const addressInput = document.getElementById("address");
	const paymentSelect = document.getElementById("payment");
	const submitBtn = document.getElementById("orderFormBtn");

	const errorSpans = form.querySelectorAll("[data-error-message]");
	errorSpans.forEach((span) => span.classList.add("hidden"));

	// 驗證函數
	const validateField = (input, errorKey, required = true) => {
		if (required && !input.value.trim()) {
			const errorSpan = form.querySelector(`[data-error-message="${errorKey}"]`);
			if (errorSpan) {
				errorSpan.classList.remove("hidden");
			}
			return false;
		}
		return true;
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	let isValid = true;

	// 姓名驗證
	if (!validateField(nameInput, "name")) isValid = false;

	// 電話驗證
	if (!validateField(telInput, "tel")) isValid = false;

	// Email 驗證
	if (!validateField(emailInput, "mail")) {
		isValid = false;
	} else if (!validateEmail(emailInput.value.trim())) {
		const errorSpan = form.querySelector(`[data-error-message="mail"]`);
		if (errorSpan) {
			errorSpan.textContent = "Email 格式錯誤";
			errorSpan.classList.remove("hidden");
		}
		isValid = false;
	}

	// 地址驗證
	if (!validateField(addressInput, "address")) isValid = false;

	// 支付方式驗證
	if (!paymentSelect.value) {
		const errorSpan = form.querySelector(`[data-error-message="payment"]`);
		if (errorSpan) {
			errorSpan.classList.remove("hidden");
		}
		isValid = false;
	}

	if (!isValid) {
		submitBtn.textContent = "送出預定資料"; // 重置按鈕文字如果有變化
		return;
	}

	// 收集資料
	const paymentMap = {
		1: "ATM",
		2: "Apple Pay",
		3: "Google Pay",
		4: "WeChat Pay",
	};
	const selectedPayment = paymentMap[paymentSelect.value] || "ATM";

	const orderData = {
		data: {
			user: {
				name: nameInput.value.trim(),
				tel: telInput.value.trim(),
				email: emailInput.value.trim(),
				address: addressInput.value.trim(),
				payment: selectedPayment,
			},
		},
	};

	try {
		submitBtn.textContent = "送出中..."; // 顯示載入狀態
		submitBtn.disabled = true;

		const res = await axios.post(`${apiUrl}/customer/${api}/orders`, orderData);
		console.log("訂單提交成功:", res.data);
		form.reset();
		getCharts();
		alert("預定成功！感謝您的訂購。");
	} catch (error) {
		console.error("訂單提交失敗:", error);
		alert("送出失敗，請檢查資料後再試。");
	} finally {
		submitBtn.textContent = "送出預定資料";
		submitBtn.disabled = false;
	}
};

// Dashboard Order Part
const getOrders = async () => {
	try {
		if (!document.querySelector("#orderList")) return;

		const res = await axios.get(`${apiUrl}/admin/${api}/orders`, { headers: { Authorization: token } });
		tempOrders = [...res.data.orders];
		let tempHTML = "";
		tempOrders.forEach((order) => {
			const timestampMs = order.createdAt;
			const dateObj = new Date(timestampMs * 1000);
			// console.log(order);
			tempHTML += `<tr class="align-top">
										<td>${order.id}</td>
										<td>
											<p>${order.user.name}</p>
											<p>${order.user.tel}</p>
										</td>
										<td>${order.user.address}</td>
										<td>${order.user.email}</td>
										<td>
                      ${order.products.map((product) => `<p>${product.title}</p>`)}
                    </td>
										<td>${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}</td>
										<td><a class="orderStatus text-nowrap" href="javascript:;"  data-orderId="${order.id}" data-paid="${order.paid}">${order.paid == true ? `<span class="text-blue-500">己處理</span>` : `<span class="text-amber-500">未處理</span>`}</a></td>
										<td>
											<button type="button" data-orderId="${
												order.id
											}" class="deleteOrder cursor-pointer bg-alert hover:bg-primary-400 px-3 py-1 rounded-sm text-center text-white text-nowrap transition-all duration-300 ease-in-out"> 
												刪除
											</button>
										</td>
									</tr>`;
		});
		document.querySelector("#orderList").innerHTML = tempHTML;

		// no order show
		if (tempOrders.length == 0 && document.querySelector("#orderList")) {
			document.querySelector("#orderList").innerHTML =
				'<tr><td colspan="8" class="text-center py-4 text-2xl">沒有訂單</td></tr>';
			return;
		}

		//  change order statue
		document.querySelectorAll(".orderStatus").forEach((status) => {
			status.addEventListener("click", (e) => {
				e.preventDefault();
				const paidAttr = status.getAttribute("data-paid");
				const paidStatus = paidAttr === "true";
				const orderId = status.getAttribute("data-orderId");
				handleOrderStatus(paidStatus, orderId);
			});
		});

		// delete signal order
		document.querySelectorAll(".deleteOrder").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				const orderId = btn.getAttribute("data-orderId");
				handleRemoveOrder(orderId);
			});
		});

    // Gen chart
    getTypeChart();
    getRankChart();
	} catch (error) {
		console.log(error.response.data.message);
	}
};

const getRankChart = () => {
  const productTotals = tempOrders.reduce((acc, order) => {
		order.products.forEach((product) => {
			// console.log(product);
			const total = product.quantity;
			acc[product.title] = (acc[product.title] || 0) + total;
		});
		return acc;
	}, {});
  const sortedProducts = Object.entries(productTotals).sort(([, a], [, b]) => b - a);
  const top3 = sortedProducts.slice(0, 3);
  const restTotal = sortedProducts.slice(3).reduce((sum, [, qty]) => sum + qty, 0);
  const columns = [
    ...top3.map(([title, total]) => [title, total]),
    ...(restTotal > 0 ? [['其他', restTotal]] : [])
  ]
  
  c3.generate({
		bindto: "#chart-itemsRank",
		data: {
			columns,
			type: "pie",
		},
		color: {
			pattern: ["#C78283", "#F3D9DC", "#D7BEA8", "#B49286"],
		},
	});
}

const getTypeChart = () => {
  console.log(tempOrders);
  
  const categoryTotals = tempOrders.reduce((acc, order) => {
		order.products.forEach((product) => {
			const total = product.price * product.quantity;
			acc[product.category] = (acc[product.category] || 0) + total;
		});
		return acc;
	}, {});

  const displayData = Object.entries(categoryTotals).map(([category, total]) => [category, total]);
  // console.log(displayData);

  c3.generate({
		bindto: "#chart-type",
		data: {
			type: "pie",
			columns: displayData,
		},
		color: {
			pattern: ["#5434A7", "#9D7FEA", "#DACBFF"],
		},
	});
}

const handleOrderStatus = async (status, id) => {
	try {
		const newStatus = !status;
		const dataObj = {
			data: {
				id,
				paid: newStatus,
			},
		};
		const res = await axios.put(`${apiUrl}/admin/${api}/orders`, dataObj, { headers: { Authorization: token } });
		console.log(res.data);
		getOrders();
	} catch (err) {
		console.log(error.response.data.message);
	}
};

const handleRemoveOrder = async (id) => {
	try {
		const res = await axios.delete(`${apiUrl}/admin/${api}/orders/${id}`, { headers: { Authorization: token } });
		getOrders();
	} catch (error) {
		console.log(error.response.data.message);
	}
};

const bindDeleteAllOrderBtn = () => {
	const removeAllOrder = document.querySelector("#removeAllOrder");
	if (removeAllOrder) {
		removeAllOrder.removeEventListener("click", handleDeleteAllOrder);
		removeAllOrder.addEventListener("click", handleDeleteAllOrder);
	}
};

const handleDeleteAllOrder = async () => {
	try {
		await axios.delete(`${apiUrl}/admin/${api}/orders`, { headers: { Authorization: token } });
		getOrders();
	} catch (error) {
		console.log(error.response.data.message);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	generateMainNav();
	getProducts();
	getCharts();
	bindDeleteAllBtn();
	bindSubmitForm();
	getOrders();
	bindDeleteAllOrderBtn();
});
