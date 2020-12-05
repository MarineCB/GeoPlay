export default function (ctx) {
	updateData(ctx.app)
	if (!isAuth()) {
		ctx.redirect('/login')
	} else {
		switch (ctx.route.name) {
			case 'game':
				if (!canLoadQuiz(ctx)) {
					ctx.redirect('/homepage')
				}
				break;
			case 'result':
				if (!canLoadResults(ctx)) {
					ctx.redirect('/homepage')
				}
				break;
		}
	}
}

function canLoadQuiz(ctx) {
	return ctx.route.params.hasOwnProperty('id_quiz')
}

function canLoadResults(ctx) {
	return ctx.route.params.hasOwnProperty('score')
	&& ctx.route.params.hasOwnProperty('maxScore')
}

function isAuth() {
	return JSON.parse(sessionStorage.getItem('authenticated'))
}

function updateData(app) {
	if (isAuth(app)) {
		app.store.commit('users/connect', JSON.parse(sessionStorage.getItem('user')))
	}
}