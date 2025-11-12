import "./style.css";

import axios from "axios";
import { generateMainNav } from "./components/header.js";

const apiUrl = "https://livejs-api.hexschool.io/api/livejs/v1";
const api = "jsweek9api";
let tempProducts = [];
let tempCarts = [];
let tempOrders = [];
const token = "1yHPMFbDY6Wb1mQaaZnTPsRgGyM2";

const getOrders = async () => {
	try {
		if (!document.querySelector("#orderList")) return;

		const res = await axios.get(`${apiUrl}/admin/${api}/orders`, { headers: { Authorization: token } });
		tempOrders = [...res.data.orders];
		let tempHTML = "";
		tempOrders.forEach((order) => {
			const timestampMs = order.createdAt;
			const dateObj = new Date(timestampMs * 1000);
			tempHTML += `<tr class="align-top">
										<td>${order.id}</td>
										<td>
											<p>${order.user.name}</p>
											<p>${order.user.tel}</p>
										</td>
										<td>${order.user.address}</td>
										<td>${order.user.email}</td>
										<td>
                      ${order.products.map((product) => `<p>${product.title}</p>`).join("")}
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

		if (tempOrders.length == 0 && document.querySelector("#orderList")) {
			document.querySelector("#orderList").innerHTML =
				'<tr><td colspan="8" class="text-center py-4 text-2xl">沒有訂單</td></tr>';
			return;
		}

		document.querySelectorAll(".orderStatus").forEach((status) => {
			status.addEventListener("click", (e) => {
				e.preventDefault();
				const paidAttr = status.getAttribute("data-paid");
				const paidStatus = paidAttr === "true";
				const orderId = status.getAttribute("data-orderId");
				handleOrderStatus(paidStatus, orderId);
			});
		});

		document.querySelectorAll(".deleteOrder").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				const orderId = btn.getAttribute("data-orderId");
				handleRemoveOrder(orderId);
			});
		});

		getTypeChart();
		getRankChart();
	} catch (error) {
		console.log(error.response?.data?.message || error);
	}
};

const getRankChart = () => {
	const productTotals = tempOrders.reduce((acc, order) => {
		order.products.forEach((product) => {
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
		...(restTotal > 0 ? [["其他", restTotal]] : []),
	];

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
};

const getTypeChart = () => {
	const categoryTotals = tempOrders.reduce((acc, order) => {
		order.products.forEach((product) => {
			const total = product.price * product.quantity;
			acc[product.category] = (acc[product.category] || 0) + total;
		});
		return acc;
	}, {});

	const displayData = Object.entries(categoryTotals).map(([category, total]) => [category, total]);

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
};

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
		getOrders();
	} catch (err) {
		console.log(err.response?.data?.message || err);
	}
};

const handleRemoveOrder = async (id) => {
	try {
		await axios.delete(`${apiUrl}/admin/${api}/orders/${id}`, { headers: { Authorization: token } });
		getOrders();
	} catch (error) {
		console.log(error.response?.data?.message || error);
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
		console.log(error.response?.data?.message || error);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	generateMainNav();
	getOrders();
	bindDeleteAllOrderBtn();
});
