function back(){if(state.screen==='activity'){state.screen=state.duty?'duty':'course'}else if(state.screen==='duty'){state.screen='course'}else{state.screen='home'}render();window.scrollTo(0,0)}
Object.assign(window,{back});
