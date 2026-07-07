"use client";

import { motion } from "framer-motion";
import { Send, Upload } from "lucide-react";
import { useState } from "react";
import {
  AnimatedSection,
  SectionHeader,
} from "@/components/common/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FEATURE_OPTIONS, PAGE_OPTIONS } from "@/constants/contact";

export function Estimate() {
  const [submitted, setSubmitted] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const toggleItem = (
    item: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <AnimatedSection id="estimate" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="Estimate"
          title="온라인 견적 문의"
          description="홈페이지 제작 요구사항서를 작성해 주시면 빠르게 견적을 안내해 드립니다"
        />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">회사명</Label>
              <Input id="company" placeholder="회사명을 입력해 주세요" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">담당자</Label>
              <Input id="contact" placeholder="담당자명" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input id="phone" type="tel" placeholder="010-0000-0000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="email@company.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">예산</Label>
              <Input id="budget" placeholder="예: 300만원" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">희망 일정</Label>
              <Input id="schedule" placeholder="예: 2개월 이내" />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Label>필요한 페이지</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAGE_OPTIONS.map((page) => (
                <label
                  key={page}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={pages.includes(page)}
                    onCheckedChange={() => toggleItem(page, pages, setPages)}
                  />
                  {page}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Label>필요한 기능</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FEATURE_OPTIONS.map((feature) => (
                <label
                  key={feature}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={features.includes(feature)}
                    onCheckedChange={() =>
                      toggleItem(feature, features, setFeatures)
                    }
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <Label htmlFor="reference">참고 사이트</Label>
            <Input id="reference" placeholder="https://example.com" />
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="file">파일 첨부</Label>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <Input
                id="file"
                type="file"
                className="border-0 p-0 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="notes">추가 요청사항</Label>
            <Textarea
              id="notes"
              placeholder="추가로 전달하고 싶은 내용을 자유롭게 작성해 주세요"
            />
          </div>

          <Button type="submit" size="lg" className="mt-8 w-full group">
            {submitted ? (
              "접수 완료! 곧 연락드리겠습니다."
            ) : (
              <>
                견적 문의 제출
                <Send className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </AnimatedSection>
  );
}
