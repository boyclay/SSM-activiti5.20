package com.java.activiti.service.impl;

import com.java.activiti.dao.t_leaveDao;
import com.java.activiti.model.t_leave;
import com.java.activiti.service.t_leaveService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class t_leaveServiceImpl implements t_leaveService {
    @Autowired
    private t_leaveDao t_leaveDao;

    @Override
    public int deleteByPrimaryKey(Integer id) {
        return t_leaveDao.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(t_leave record) {
        return t_leaveDao.insert(record);
    }

    @Override
    public t_leave selectByPrimaryKey(Integer id) {
        return t_leaveDao.selectByPrimaryKey(id);
    }

    @Override
    public List<t_leave> selectAll() {
        return t_leaveDao.selectAll();
    }

    @Override
    public int updateByPrimaryKey(t_leave record) {
        return t_leaveDao.updateByPrimaryKey(record);
    }
}