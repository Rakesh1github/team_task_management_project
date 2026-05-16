package com.ethara.dto;



import lombok.Data;

@Data

public class MemberResponseDto {

    private Long projectMemberId;

    private Long id;

    private String name;

    private String email;

    private String projectName;
}
