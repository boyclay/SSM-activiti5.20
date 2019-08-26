package com.java.activiti.shiro;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.subject.support.DefaultSubjectContext;

import com.java.activiti.model.Group;
import com.java.activiti.model.Resources;
import com.java.activiti.model.User;
import com.java.activiti.service.GroupService;
import com.java.activiti.service.ResourcesService;
import com.java.activiti.service.UserService;

public class UserRealm extends AuthorizingRealm {

	@Resource
	private UserService userService;

	@Resource
	private GroupService groupService;

	@Resource
	private ResourcesService resourcesService;
	
	@Resource
	private RedisSessionDAO redisSessionDAO;

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		String username = principals.getPrimaryPrincipal().toString();
		List<Group> groupList = groupService.findByUserId(username);// 获取组
		List<Resources> resourceList = resourcesService.getPermissions(username);// 获取组
		Set<String> roles = new HashSet<String>();
		for (Group group : groupList) {
			roles.add(group.getId());
		}
		Set<String> permissions = new HashSet<String>();
		for (Resources resource : resourceList) {
			permissions.add(resource.getResurl());
		}
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		authorizationInfo.setRoles(roles);// 设置角色
		authorizationInfo.setStringPermissions(permissions);// 设置增删改查的权限
		return authorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		// getPrincipal 获取用户名 getCredentials() 获取密码
		String username = token.getPrincipal().toString();
		User user = userService.findById(username);// 通过数据库进行查询
		if (user == null) {
			throw new UnknownAccountException(); // 没有找到账号
		}
		// 处理session
		Collection<Session> sessions = redisSessionDAO.getActiveSessions();
		for (Session session : sessions) {
			// 清除该 用户以前登录时保存的session
			Object obj = session.getAttribute(DefaultSubjectContext.PRINCIPALS_SESSION_KEY);
			SimplePrincipalCollection coll = (SimplePrincipalCollection) obj;
			if (coll != null) {
				if (username.equals(coll.getPrimaryPrincipal())) {
					redisSessionDAO.delete(session);
				}
			}
		}
		// 交给AuthenticationRealm使用CredentialsMatcher进行密码匹配
		SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user.getId(), // 用户名
				user.getPassword(), // 密码
				getName() // realm name
		);
		return authenticationInfo;
	}
}
