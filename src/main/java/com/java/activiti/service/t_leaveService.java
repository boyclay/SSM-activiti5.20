package com.java.activiti.service;

import com.java.activiti.model.t_leave;
import java.util.List;

public interface t_leaveService {
    int deleteByPrimaryKey(Integer id);

    int insert(t_leave record);

    t_leave selectByPrimaryKey(Integer id);

    List<t_leave> selectAll();

    int updateByPrimaryKey(t_leave record);
}