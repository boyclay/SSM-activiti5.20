package com.java.activiti.model;

import java.util.Date;

public class t_leave {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.id
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private Integer id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.userId
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private String userid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.leaveDate
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private Date leavedate;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.leaveDays
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private Integer leavedays;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.state
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private String state;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.processInstanceId
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private String processinstanceid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.leaveType
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private String leavetype;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_leave.leaveReason
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    private String leavereason;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.id
     *
     * @return the value of t_leave.id
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public Integer getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.id
     *
     * @param id the value for t_leave.id
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.userId
     *
     * @return the value of t_leave.userId
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public String getUserid() {
        return userid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.userId
     *
     * @param userid the value for t_leave.userId
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setUserid(String userid) {
        this.userid = userid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.leaveDate
     *
     * @return the value of t_leave.leaveDate
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public Date getLeavedate() {
        return leavedate;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.leaveDate
     *
     * @param leavedate the value for t_leave.leaveDate
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setLeavedate(Date leavedate) {
        this.leavedate = leavedate;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.leaveDays
     *
     * @return the value of t_leave.leaveDays
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public Integer getLeavedays() {
        return leavedays;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.leaveDays
     *
     * @param leavedays the value for t_leave.leaveDays
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setLeavedays(Integer leavedays) {
        this.leavedays = leavedays;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.state
     *
     * @return the value of t_leave.state
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public String getState() {
        return state;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.state
     *
     * @param state the value for t_leave.state
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setState(String state) {
        this.state = state;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.processInstanceId
     *
     * @return the value of t_leave.processInstanceId
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public String getProcessinstanceid() {
        return processinstanceid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.processInstanceId
     *
     * @param processinstanceid the value for t_leave.processInstanceId
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setProcessinstanceid(String processinstanceid) {
        this.processinstanceid = processinstanceid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.leaveType
     *
     * @return the value of t_leave.leaveType
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public String getLeavetype() {
        return leavetype;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.leaveType
     *
     * @param leavetype the value for t_leave.leaveType
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setLeavetype(String leavetype) {
        this.leavetype = leavetype;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_leave.leaveReason
     *
     * @return the value of t_leave.leaveReason
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public String getLeavereason() {
        return leavereason;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_leave.leaveReason
     *
     * @param leavereason the value for t_leave.leaveReason
     *
     * @mbggenerated Mon Aug 12 17:15:18 CST 2019
     */
    public void setLeavereason(String leavereason) {
        this.leavereason = leavereason;
    }
}