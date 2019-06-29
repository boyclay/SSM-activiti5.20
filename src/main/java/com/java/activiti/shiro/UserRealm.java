package com.java.activiti.shiro;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

import com.java.activiti.model.Group;
import com.java.activiti.model.User;
import com.java.activiti.service.GroupService;
import com.java.activiti.service.UserService;

public class UserRealm extends AuthorizingRealm {
	
	@Resource
	private UserService userService;
	
	@Resource
	private GroupService groupService;

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		String username = principals.getPrimaryPrincipal().toString();
		List<Group> groupList = groupService.findByUserId(username);
		Set<String> roles= new HashSet<String>();
		for(Group group:groupList){
			roles.add(group.getId());
		}
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		authorizationInfo.setRoles(roles);//���ý�ɫ
		authorizationInfo.setStringPermissions(null);//������ɾ�Ĳ��Ȩ��
		return authorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		// getPrincipal ��ȡ�û��� getCredentials() ��ȡ����
		String username = token.getPrincipal().toString();
		User user = userService.findById(username);//ͨ�����ݿ���в�ѯ
		if (user == null) {
			throw new UnknownAccountException(); // û���ҵ��˺�
		}
		// ����AuthenticationRealmʹ��CredentialsMatcher��������ƥ��
		SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user.getId(), // �û���
				user.getPassword(), // ����
				getName() // realm name
		);
		return authenticationInfo;
	}
}
