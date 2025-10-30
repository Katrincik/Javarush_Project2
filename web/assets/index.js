document.addEventListener("DOMContentLoaded", () => {
	document.body.innerHTML = "";

	const user = JSON.parse(localStorage.getItem("user") || "null");

	const root = document.createElement("div");
	root.id = "root";
	root.classList.add("chat-page");

	// Header
	const chatHeader = document.createElement("div");
	chatHeader.classList.add("chat-header");
	const header = document.createElement("header");
	chatHeader.appendChild(header);

	const avatarChat = document.createElement("div");
	avatarChat.classList.add("avatar-chat");

	const profileButton = document.createElement("button");
	profileButton.classList.add("profile-button");

	const imgProfileButton = document.createElement("img");
	imgProfileButton.src = "../img/Vector.png";
	imgProfileButton.alt = "Open profile";
	profileButton.appendChild(imgProfileButton);

	const headerChatName = document.createElement("div");
	headerChatName.classList.add("header-chat-name");

	const chatName = document.createElement("p");
	chatName.classList.add("chat-name");
	chatName.innerText = "The CSS Whisperer"

	const online = document.createElement("p");
	online.classList.add("online");
	online.innerText = "Online";

	const userAvatarImg = document.createElement("img");
	const avatarSrc = user.avatar || "../img/54279169a30dad0cbbd19437ba4d81b26ecdc003.jpg";
	userAvatarImg.setAttribute("src", avatarSrc);
	userAvatarImg.setAttribute("width", 42);
	userAvatarImg.setAttribute("height", 42);
	userAvatarImg.classList.add("user-avatar");

	avatarChat.appendChild(userAvatarImg);

	headerChatName.appendChild(chatName);
	headerChatName.appendChild(online);

	avatarChat.appendChild(headerChatName);
	header.appendChild(avatarChat);
	header.appendChild(profileButton);
	root.appendChild(chatHeader);

	let profileMenuBlock = null;
	let profileMenuIsOpened = false;

	const initProfileButton = () => {
		const chatButton = document.querySelector(".profile-button");

		chatButton.addEventListener("click", function (event) {
			event.stopPropagation();

			if (profileMenuIsOpened) {
				destroyProfileMenu();
				return;
			}

			profileMenuBlock = document.createElement("div");
			profileMenuBlock.classList.add("login-overlay");
			root.appendChild(profileMenuBlock);

			profileMenuIsOpened = true;

			setTimeout(() => {
				document.addEventListener("click", handleOutsideClick);
			}, 0);

		});
	};

	function handleOutsideClick(e) {
		if (profileMenuBlock && !profileMenuBlock.contains(e.target) && !e.target.classList.contains("login-overlay")) {
			destroyProfileMenu();
			document.removeEventListener("click", handleOutsideClick);
		}

		if ( messageConfigBlock && !messageConfigBlock.contains(e.target) && !e.target.classList.contains("config-button")) {
			destroyMessageConfig();
			document.removeEventListener("click", handleOutsideClick);
		}
	}

	const destroyProfileMenu = () => {
		if (profileMenuBlock) {
			profileMenuBlock.remove();
			profileMenuBlock = null;
		}
		profileMenuIsOpened = false;
	}

	// Chat messages container
	const chatMessages = document.createElement("div");
	chatMessages.classList.add("chat-messages");

	// Messages wrapper
	const messagesWrapper = document.createElement("div");
	messagesWrapper.classList.add("messages-wrapper");
	chatMessages.appendChild(messagesWrapper);

	const spacer = document.createElement("div");
	spacer.classList.add("spacer");
	messagesWrapper.appendChild(spacer);

	// Message input form section
	const messageInputForm = document.createElement("div");
	messageInputForm.classList.add("message-input-form");
	chatMessages.appendChild(messageInputForm);

	const form = document.createElement("form");
	form.classList.add("bottom-form");

	const inputWrapper = document.createElement("div");
	inputWrapper.classList.add("input-wrapper");

	const textarea = document.createElement("textarea");
	textarea.classList.add("input-message");
	textarea.placeholder = "Enter your message...";

	const button = document.createElement("button");
	button.type = "submit";
	button.classList.add("submit-message-button");

	const img = document.createElement("img");
	img.src = "../img/send.png";
	img.alt = "Send";
	button.appendChild(img);

	inputWrapper.appendChild(textarea);
	inputWrapper.appendChild(button);
	form.appendChild(inputWrapper);
	messageInputForm.appendChild(form);

	// messagesWrapper.appendChild(messageInputForm);
	root.appendChild(chatMessages);
	document.body.appendChild(root);

	let formMessageElement = null;
	// let messagesWrapperDiv = null;

	let inputValue = " ";
	let inoutMessageElement = null;
	let messageConfigBlock = null;
	let messageConfigIsOpened = false;

	const baseHeight = 68;  // 2 lines
	const expandedHeight = 96;  // 3+ lines

	textarea.addEventListener("input", () => {
		textarea.style.height = "auto";

		if (textarea.scrollHeight > baseHeight * 1.45) {
			textarea.style.height = expandedHeight + "px";
			textarea.style.padding = "12px 92px 12px 24px";
		} else {
			textarea.style.height = baseHeight + "px";
			textarea.style.padding = "22px 92px 22px 24px";
		}
	});

	let editingMessageId = null;

	const initBottomFormMessage = () => {
		formMessageElement = form;
		inoutMessageElement = textarea;

		formMessageElement.addEventListener("submit", async function (event) {
			try {
				event.preventDefault();
				const content = inoutMessageElement.value.trim();
				if (!content) return;

				const username = user.username;

				// const messageObject = {
				// 	username,
				// 	content,
				// };

				let response;

				if (editingMessageId) {
					// PATCH existing message
					response = await fetch(`/api/message/${editingMessageId}`, {
						method: "PATCH",
						headers: {"Content-Type": "application/json"},
						body: JSON.stringify({content}),
					});
					editingMessageId = null;
				} else {
					response = await fetch("/api/message", {
						method: "POST",
						headers: {"Content-Type": "application/json"},
						body: JSON.stringify({username, content}),
					});
				}

				const data = await response.json();
				console.log("data: ", data);
				document.location.reload();
				// inoutMessageElement.value = "";
				// await initFetchMessages();
				// messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
			} catch (error) {
				console.log("ERROR: ", error);
			}
		});
	};

	const initFetchMessages = () => {
		return fetch(`/api/messages`)
			.then((res) => res.json())
			.then((body) => {
				console.log("messages: ", body.messages);

				const messages = body.messages;

				messagesWrapper.querySelectorAll(".message").forEach((m) => m.remove());

				messages.forEach((message) => {
					let createdAt = new Date(message.created_at);
					let now = new Date();

					const isToday =
						createdAt.getFullYear() === now.getFullYear() &&
						createdAt.getMonth() === now.getMonth() &&
						createdAt.getDate() === now.getDate();

					if (isToday && !document.querySelector(".today-separator")) {
						const todaySeparator = document.createElement("p");
						todaySeparator.classList.add("today-separator");
						todaySeparator.innerText = "Today";
						messagesWrapper.appendChild(todaySeparator);
					}

					const isUserAuthorOfMessage =
						user && message.username === user.username;

					const messageDiv = document.createElement("div");
					messageDiv.classList.add("message");

					const rawDate = message.created_at;
					console.log("created_at raw:", rawDate);

					if (typeof rawDate === "string" && rawDate.includes(" ")) {
						createdAt = new Date(rawDate.replace(" ", "T"));
					} else {
						createdAt = new Date(rawDate);
					}

					if (isNaN(createdAt.getTime())) {
						console.warn("Invalid date format for:", rawDate);
						return;
					}

					let timeString;
					if (isToday) {
						timeString = createdAt.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						});
					} else {
						timeString = createdAt.toLocaleString("en-GB", {
							day: "numeric",
							month: "short",
							hour: "2-digit",
							minute: "2-digit",
						});
					}

					const messageData = document.createElement("div");
					messageData.classList.add("message-data");

					const userAndTime = document.createElement("div");
					userAndTime.classList.add("message-meta");

					const messageTimeP = document.createElement("p");
					messageTimeP.classList.add("message-time");
					messageTimeP.innerText = timeString;

					const messageP = document.createElement("p");
					messageP.innerHTML = message.content;

					const avatarList = [
						"../img/31e2d13181abbd6c6e1fb445f4c83b55c0222b14.png",
						"../img/30368c044177b597a7615e10db62f1a9aed756aa.png",
						"../img/981820c6d6fb5c2f063baf30cebd6701584a651c.png",
					];

					function getConsistentAvatar(username) {
						let sum = 0;
						for (let i = 0; i < username.length; i++) {
							sum += username.charCodeAt(i);
						}
						return avatarList[sum % avatarList.length];
					}

					const messageAvatarImg = document.createElement("img");
					const avatarImage = message.avatar || getConsistentAvatar(message.username);
					messageAvatarImg.setAttribute("src", avatarImage);
					messageAvatarImg.setAttribute("width", 32);
					messageAvatarImg.setAttribute("height", 32);
					messageAvatarImg.classList.add("message-avatar-img");

					const messageUsernameP = document.createElement("p");
					messageUsernameP.classList.add("message-username");
					messageUsernameP.innerText = message.username;
					// messageData.appendChild(messageUsernameP);

					userAndTime.appendChild(messageUsernameP);
					userAndTime.appendChild(messageTimeP);
					// messageDiv.appendChild(userAndTime);
					// messageDiv.appendChild(messageP);
					messageData.appendChild(userAndTime);
					messageData.appendChild(messageP);

					if (isUserAuthorOfMessage) {
						messageDiv.classList.add("message-of-mine");

						const messageConfigButton = document.createElement("button");
						// messageConfigButton.innerText = "config";
						const configButton = document.createElement("img");
						configButton.src = "../img/Vector2.png";
						messageConfigButton.appendChild(configButton);
						messageConfigButton.classList.add("config-button");
						// messageDiv.appendChild(messageConfigButton);
						userAndTime.appendChild(messageConfigButton);

						messageConfigButton.addEventListener("click", function (event) {
							if (messageConfigIsOpened) destroyMessageConfig();
							const { clientX: xCoord, clientY: yCoord } = event;
							console.log("xCoord: ", xCoord, " yCoord: ", yCoord);

							messageDiv.classList.add("message-menu-opened");

							messageConfigBlock = document.createElement("div");
							messageConfigBlock.classList.add("message-config");
							// messageConfigBlock.style.top = yCoord + "px";
							// messageConfigBlock.style.left = xCoord + "px";

							const buttonEdit = document.createElement("button");
							const buttonDelete = document.createElement("button");
							buttonEdit.innerText = "Edit";
							buttonDelete.innerText = "Delete";

							messageConfigBlock.appendChild(buttonEdit);
							messageConfigBlock.appendChild(buttonDelete);

							buttonEdit.addEventListener("click", function (event) {
								inputValue = message.content;
								inoutMessageElement.value = message.content;
								editingMessageId = message.uuid;

							});

							buttonDelete.addEventListener("click", async function (){
								const response = await fetch(`/api/message/${message.uuid}`, {
									method: "DELETE",
								});

								if (!response.ok) {
									throw new Error("Failed to delete message");
								}

								messageDiv.remove();

								console.log(`Message ${message.uuid} deleted`);
							})

							messageDiv.appendChild(messageConfigBlock);
							messageConfigIsOpened = true;

							setTimeout(() => {
								document.addEventListener("click", handleOutsideClick);
							}, 0);
						});
						// function handleOutsideClick(e) {
						// 	if (
						// 		messageConfigBlock &&
						// 		!messageConfigBlock.contains(e.target) &&
						// 		!e.target.classList.contains("config-button")
						// 	) {
						// 		destroyMessageConfig();
						// 		document.removeEventListener("click", handleOutsideClick);
						// 	}
						// }
					}
					messageDiv.appendChild(messageAvatarImg);
					messageDiv.appendChild(messageData);
					messagesWrapper.appendChild(messageDiv);
				});
				messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
				if (user) {
					initBottomFormMessage();
					initProfileButton();
				}
			});
	};

	// const destroyOldContent = () => {
	// 	root.removeChild(messagesWrapperDiv);
	// 	root.removeChild(formMessageElement);
	// 	messagesWrapperDiv = null;
	// 	formMessageElement = null;
	// };

	const destroyMessageConfig = () => {
		while (messageConfigBlock) {
			const messageMenu = document.querySelector(".message-menu-opened");

			if (!messageMenu || !messageConfigBlock) {
				messageConfigBlock = null;
				messageConfigIsOpened = false;
				return;
			}

			if (messageMenu.contains(messageConfigBlock)) {
				messageMenu.removeChild(messageConfigBlock);
			}

			messageMenu.classList.remove("message-menu-opened");
			messageConfigBlock = null;
			messageConfigIsOpened = false;
		}
	};

	if (!user) {
		const headerNonAuth = document.createElement("header");
		headerNonAuth.innerText = "The CSS Whisperer";
		root.appendChild(headerNonAuth);

		const buttonForCallingAuthDialog = document.createElement("button");
		buttonForCallingAuthDialog.innerText = "Log in";
		headerNonAuth.appendChild(buttonForCallingAuthDialog);

		buttonForCallingAuthDialog.addEventListener("click", function (event) {
			event.preventDefault();

			const dialogForAuthWrapper = document.createElement("div");
			dialogForAuthWrapper.classList.add("dialog-auth-wrapper");
			const dialogForAuth = document.createElement("div");
			dialogForAuth.classList.add("dialog-auth");

			const formForAuth = document.createElement("form");
			const inputForAuth = document.createElement("input");
			const buttonSubmitAuth = document.createElement("button");
			buttonSubmitAuth.innerText = "Log in";
			const buttonLeaveAuth = document.createElement("button");
			buttonLeaveAuth.innerText = "Close";

			formForAuth.appendChild(inputForAuth);
			formForAuth.appendChild(buttonSubmitAuth);
			formForAuth.appendChild(buttonLeaveAuth);

			dialogForAuth.appendChild(formForAuth);

			dialogForAuthWrapper.appendChild(dialogForAuth);
			root.appendChild(dialogForAuthWrapper);

			formForAuth.addEventListener("submit", async function (event) {
				try {
					event.preventDefault();
					const username = event.target[0].value;
					console.log("username: ", username);

					const response = await fetch(`/api/user?username=${username}`);
					const data = await response.json();
					console.log("data: ", data);
					const user = data.user;
					localStorage.setItem("user", JSON.stringify(user));
					document.location.reload();
				} catch (error) {
					alert(error);
				}
			});
			buttonLeaveAuth.addEventListener("click", () =>
				dialogForAuthWrapper.remove()
			);
		});
	}
	initFetchMessages();
});