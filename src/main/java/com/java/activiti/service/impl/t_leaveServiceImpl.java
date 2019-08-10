package com.java.activiti.service.impl;

import com.java.activiti.dao.t_leaveMapper;
import com.java.activiti.service.t_leaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class t_leaveServiceImpl implements t_leaveService {
    @Autowired
    private t_leaveMapper t_leaveMapper;
}