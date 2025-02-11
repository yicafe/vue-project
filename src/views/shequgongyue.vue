<template>
  <div class="min-h-screen px-4 py-8 bg-gray-100 sm:px-6 lg:px-8">
    <div class="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 class="mb-6 text-3xl font-bold text-center text-gray-800">社区公约</h1>
      <p class="mb-6 text-gray-700">
        欢迎加入我们的社区！为了确保每位用户都能在一个安全、友好、积极的环境中交流和分享，我们制定了以下社区公约。请仔细阅读并遵守这些规则，共同维护一个健康和谐的社区氛围。
      </p>

      <!-- 社区公约内容 -->
      <div class="space-y-6">
        <Section title="1. 尊重他人">
          <p><strong>文明用语：</strong>请使用礼貌、尊重的语言与他人交流，避免使用侮辱性、攻击性、歧视性言辞。</p>
          <p><strong>包容多样性：</strong>尊重不同的观点、文化和背景，不因种族、性别、宗教、国籍等因素歧视他人。</p>
        </Section>

        <Section title="2. 禁止不当内容">
          <p><strong>违法信息：</strong>严禁发布任何违反法律法规的内容，包括但不限于暴力、色情、赌博、毒品。</p>
          <p><strong>虚假信息：</strong>不传播虚假、误导性信息，尤其是涉及健康、安全、金融等领域的谣言。</p>
          <p><strong>广告与垃圾信息：</strong>禁止发布未经许可的广告、推广信息或重复性内容。</p>
        </Section>

        <Section title="3. 保护隐私">
          <p><strong>尊重隐私：</strong>不公开他人的个人信息，包括但不限于姓名、地址、电话号码、电子邮件等。</p>
          <p><strong>禁止人肉搜索：</strong>不得通过任何方式搜集、发布他人的隐私信息。</p>
        </Section>

        <Section title="4. 原创与版权">
          <p><strong>原创内容：</strong>鼓励发布原创内容，尊重他人的知识产权。转载他人作品时，请注明出处并获得授权。</p>
          <p><strong>禁止盗版：</strong>严禁分享盗版软件、电影、音乐、书籍等受版权保护的内容。</p>
        </Section>

        <Section title="5. 安全与责任">
          <p><strong>账号安全：</strong>请妥善保管您的账号信息，避免账号被盗用。如发现异常，请及时联系管理员。</p>
          <p><strong>责任自负：</strong>用户在社区发布的内容仅代表其个人观点，与平台无关。用户需对自身言论和行为负责。</p>
        </Section>

        <Section title="6. 举报与处理">
          <p><strong>举报机制：</strong>如发现违反社区公约的行为，请反馈给管理员。</p>
          <p><strong>处理措施：</strong>管理员有权根据情节轻重，对违规用户采取警告、禁言、封号等措施。</p>
        </Section>
      </div>

      <!-- 个人隐私提醒 -->
      <h2 class="mt-10 mb-6 text-2xl font-bold text-gray-800">个人隐私提醒</h2>
      <div class="space-y-6">
        <Section title="1. 信息收集">
          <p><strong>注册信息：</strong>在注册过程中，您需要填写如用户名（用户昵称）、电子邮件地址等。这些信息将用于账号管理和服务提供。</p>
          <p><strong>发布内容：</strong>您在社区发布的内容（如帖子、评论、图片等）会被其他用户看到且不可删除，请谨慎发布内容。</p>
        </Section>

        <Section title="2. 信息使用">
          <p><strong>服务优化：</strong>我们不会使用您的任何信息等。</p>
          <p><strong>第三方服务：</strong>我们不会将您的个人信息出售给第三方。</p>
        </Section>

        <Section title="3. 信息安全">
          <p><strong>数据保护：</strong>本平台除注册用户名和邮箱不可填写任何其他个人隐私信息，防止个人信息泄露。</p>
          <p><strong>密码安全：</strong>请设置强密码，避免使用简单或常见的密码。</p>
        </Section>

        <Section title="4. 隐私设置">
          <p><strong>隐私控制：</strong>发布帖子后会显示你的用户名和发布内容；所有用户可见。</p>
          <p><strong>删除信息：</strong>帖子内容后无法删除，请谨慎发帖，如需删除请联系管理员。</p>
        </Section>

        <Section title="5. 隐私政策更新">
          <p><strong>政策变更：</strong>我们可能会根据法律法规或服务需求更新隐私政策。如有重大变更，我们将通过公告或邮件通知您。</p>
        </Section>
      </div>

      <!-- 结尾 -->
      <p class="mt-10 text-gray-700">
        感谢您阅读并遵守社区公约和个人隐私提醒。我们希望您能在这里享受愉快的交流体验，共同建设一个积极、健康的社区环境！
        注意：个人发布所有内容必须符合中国的法律法规，作者会不定期清理失效，如被误删，可联系管理员；本平台没有任何收费内容;个人发布的信息目前无法长期储存；请做好备份；否则会造成你的数据丢失。
        
      </p>
    </div>
  </div>
</template>

<script>
import Section from '../components/Section.vue';

export default {
  components: {
    Section,
  },
};
</script>