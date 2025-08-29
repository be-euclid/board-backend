import { DataSource } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { Post } from '../../entities/post.entity';
import { Document } from '../../entities/document.entity';
import { Section } from '../../entities/section.entity';

export async function seedData(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const categoryRepo = queryRunner.manager.getRepository(Category);
    const postRepo = queryRunner.manager.getRepository(Post);
    const documentRepo = queryRunner.manager.getRepository(Document);
    const sectionRepo = queryRunner.manager.getRepository(Section);

    // 기존 데이터 삭제 (개발환경에서만)
    await sectionRepo.delete({});
    await postRepo.delete({});
    await documentRepo.delete({});
    await categoryRepo.delete({});

    // 카테고리 생성
    const categories = await categoryRepo.save([
      { 
        id: 'class', 
        name: '수업', 
        description: '수업 관련 게시판입니다.' 
      },
      { 
        id: 'delicious', 
        name: '맛집', 
        description: '맛집 추천 게시판입니다.' 
      },
      { 
        id: 'guitar', 
        name: '기타', 
        description: '기타 정보 게시판입니다.' 
      },
      { 
        id: 'cat1', 
        name: '카테고리1', 
        description: '문서 카테고리1입니다.' 
      },
      { 
        id: 'cat2', 
        name: '카테고리2', 
        description: '문서 카테고리2입니다.' 
      },
      { 
        id: 'cat3', 
        name: '카테고리3', 
        description: '문서 카테고리3입니다.' 
      },
    ]);

    // 수업 게시글 생성
    const classPosts = await postRepo.save([
      {
        title: '최서윤 교수님',
        content: '최서윤 교수님에 대한 정보입니다.',
        author: '작성자',
        categoryId: 'class'
      },
      {
        title: '김민기 교수님',
        content: `저는 수학은 김민기 교수님 찬양합니다.... 어느 수학과목이든저는 수학은 김민기 교수님 찬양합니다.... 어느 수학과목이든 상관없이요. 강의력, 시험출제스타일, 빠른 피드백, fm만을 강조하지 않는 융통성 등등 모두 빠질것 없이 훌륭하세요. 드라마 신병3의 가라중대장 느낌입니다. 수학에 흥미가 없어서 외우면 끝인 증명을 주로 내시는 교수님을 좋아한다면 별로일 수 있지만 수학문제를 해결하는 사고과정 자체에 조금이라도 흥미가 있다면 김민기교수님을 듣지 않을 이유가 없어요.`,
        author: '작성자',
        categoryId: 'class'
      },
      {
        title: '하대청 교수님 sts',
        content: '빡세다는 소문이 있는데 그렇게 안 빡셈. 필자는 1학년 때 들었고 웬만하면 에제이상 주심',
        author: '작성자',
        categoryId: 'class'
      },
      {
        title: '경영학원론',
        content: '경영학원론 들으세요! 꿀교양이에요.',
        author: '작성자',
        categoryId: 'class'
      }
    ]);

    // 맛집 게시글 생성
    const deliciousPosts = await postRepo.save([
      {
        title: '맛집',
        content: '시그널 / 월맥 / 역할맥',
        author: '작성자',
        categoryId: 'delicious'
      },
      {
        title: '회식',
        content: '영도씨: 그냥 맛있음.' ,
        author: '작성자',
        categoryId: 'delicious'
      },
      {
        title: '국밥',
        content: '정우림국밥: 생긴지 얼마 안됐으나 가본다면 국밥의 프리미엄은 어떤 모습을 갖춰야 하는지 알 수 있습니다.. 가까워서 방문도 쉬워요. 전 소고기국밥만 먹어봤는데, 기존 소고기국밥이라면 생소할 수 있는 한방 재료들이 아낌없이 들어가 있어요. 국물을 먹어보면 몸보신되는 느낌이 제대로 들어요.',
        author: '작성자',
        categoryId: 'delicious'
      },
      {
        title: '개인(배달 위주)',
        content: '육바연 / 화궁방마라탕',
        author: '작성자',
        categoryId: 'delicious'
      },
      {

        title: '간식',
        content: '도카',
        author: '작성자',
        categoryId: 'delicious'
      }
    ]);

    // 기타 게시글 생성
    const guitarPosts = await postRepo.save([
      {
        title: '연애',
        content: '연애는 첫 중간고사 전후가 가장 이루어지기 좋은 것 같아요. 새내기가 마음이 싱숭생숭할때는 아무래도 시험 전후의 시기가 아닐까 합니다. ㅎㅎ또 미팅/소개팅, 클럽방문 등의 새내기 로망 최대한 챙기기. 마찬가지로 학년 올라갈수록 힘들어져요. 기회가 온다면 왠만하면 받아먹는게 좋아요!',         
        author: '작성자',         
        categoryId: 'guitar'       
      },       
      {         
        title: '생활',         
        content: '돈벌이 활동을 짧게라도 해봤으면 좋겠어요. 과외가 아니더라도 공부와 관련없는 알바도 좋을 것 같아요. 대학에 와서 사회에서 직접 돈을 벌어보며 돈의 소중함과 부모님의 지원이 얼마나 소중한지 깨우치고 경제관념을 다잡을 수 있어요. 학년이 올라갈수록 학업만으로 일과가 꽉 차서 하기 힘들어질 확률이 높아요.',         
        author: '작성자',         
        categoryId: 'guitar'       
      },       
      {         
        title: '술',         
        content: '템포가 너무 빠르다 싶으면 잔을 45도 기울이세요. 이게 뭐냐면 술덜 마시려는 노력이라고 함. 술 덜 먹고 싶으면 술 잘 먹는 사람 옆에 앉기.',         
        author: '작성자',         
        categoryId: 'guitar'       
      },       
      {         
        title: '기타',         
        content: '친구는 많을수록 좋다? 주변인과의 교류는 학년이 올라갈수록 급격하게 줄어들 확률이 높아요! 놀고싶어도 친구가 없어서 못 노는 경우가 꽤 많더라고요. 사람도 적은 학교에 친구마저 없으면 그 외로움 꽤 큽니다...`',
        author: '작성자',
        categoryId: 'guitar'
      }
    ]);

    // 문서 생성
    const documents = await documentRepo.save([
      {
        id: '1',
        title: '새내기 가이드',
        content: '새내기를 위한 종합 가이드 문서입니다.',
        toc: ['학교생활', '수업정보', '생활정보'],
        categoryId: 'cat1'
      },
      {
        id: '2',
        title: '맛집 종합 가이드',
        content: '캠퍼스 주변 맛집 종합 정보입니다.',
        toc: ['한식', '양식', '분식'],
        categoryId: 'cat1'
      },
      {
        id: '3',
        title: '학사 안내',
        content: '학사 일정 및 규정 안내 문서입니다.',
        toc: ['학사일정', '수강신청', '성적관리'],
        categoryId: 'cat2'
      },
      { 
        id: '4',
        title: '동아리 정보',
        content: '교내 동아리 소개 문서입니다.',
        toc: ['학술동아리', '취미동아리', '봉사동아리'],
        categoryId: 'cat2'
      },
      {
        id: '5',
        title: '취업 준비 가이드',
        content: '취업 준비를 위한 종합 가이드입니다.',
        toc: ['이력서작성', '면접준비', '자격증'],
        categoryId: 'cat3'
      },
      {
        id: '6',
        title: '기숙사 생활 가이드',
        content: '기숙사 생활을 위한 정보입니다.',
        toc: ['입사안내', '생활규칙', '편의시설'],
        categoryId: 'cat3'
      }
    ]);


    // 섹션 생성
    await sectionRepo.save([
      // 새내기 가이드 섹션들
      { title: '학교생활', content: '대학 생활의 기본적인 정보와 팁을 제공합니다.', order: 1, documentId: '1' },
      { title: '수업정보', content: '수업 선택과 관련된 유용한 정보들입니다.', order: 2, documentId: '1' },
      { title: '생활정보', content: '일상생활에서 필요한 다양한 정보들입니다.', order: 3, documentId: '1' },

      // 맛집 가이드 섹션들
      { title: '한식', content: '캠퍼스 주변의 한식 맛집 정보입니다.', order: 1, documentId: '2' },
      { title: '양식', content: '양식 레스토랑 추천 목록입니다.', order: 2, documentId: '2' },
      { title: '분식', content: '간단하고 저렴한 분식집 정보입니다.', order: 3, documentId: '2' },
  
  
      // 학사 안내 섹션들
      { title: '학사일정', content: '2024년 학사 일정 안내입니다.', order: 1, documentId: '3' },
      { title: '수강신청', content: '수강신청 방법과 주의사항입니다.', order: 2, documentId: '3' },
      { title: '성적관리', content: '성적 조회 및 관리 방법입니다.', order: 3, documentId: '3' },
  
      // 동아리 정보 섹션들
      { title: '학술동아리', content: '전공 관련 학술 동아리 소개입니다.', order: 1, documentId: '4' },
      { title: '취미동아리', content: '다양한 취미 활동 동아리들입니다.', order: 2, documentId: '4' },
      { title: '봉사동아리', content: '봉사 활동을 하는 동아리들입니다.', order: 3, documentId: '4' },

      // 취업 준비 가이드 섹션들
      { title: '이력서작성', content: '효과적인 이력서 작성 방법입니다.', order: 1, documentId: '5' },
      { title: '면접준비', content: '면접 준비와 실전 팁들입니다.', order: 2, documentId: '5' },
      { title: '자격증', content: '취업에 유리한 자격증 정보입니다.', order: 3, documentId: '5' },

      // 기숙사 생활 가이드 섹션들
      { title: '입사안내', content: '기숙사 입사 절차와 준비사항입니다.', order: 1, documentId: '6' },
      { title: '생활규칙', content: '기숙사 생활 규칙과 주의사항입니다.', order: 2, documentId: '6' },
      { title: '편의시설', content: '기숙사 내 편의시설 이용 안내입니다.', order: 3, documentId: '6' },
    ]);
    
    await queryRunner.commitTransaction();
    console.log('✅ 초기 데이터 시드 완료');
  } 
  catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ 시드 데이터 생성 실패:', error);
    throw error;
  } 
  finally {
    await queryRunner.release();
  }
}