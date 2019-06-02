package com.java.activiti.intercepter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.java.activiti.model.MemberShip;

public class LoginInterceptor implements HandlerInterceptor {


	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object arg2, Exception arg3)
			throws Exception {

	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object arg2, ModelAndView arg3)
			throws Exception {
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
		System.err.println("µÇÂ½À¹½ØÆ÷");
		Boolean flag = false;
		if (!flag) {
			MemberShip currentMemberShip = (MemberShip) request.getSession().getAttribute("currentMemberShip");
			if (currentMemberShip == null) {
				response.sendRedirect(request.getContextPath() + "/login.jsp");
				return false;
			}
		}
		return true;
	}
}
