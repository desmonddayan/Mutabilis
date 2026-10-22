package com.mutable.mutable.dto;

import java.time.LocalDate;
import java.util.List;

public record ChatRecord(List<LocalDate> selectedDates, String textAreaInput) {}
