import { useState, useEffect } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import '../../css/Blog.css';

const relatedBlogItems = [
  {
    header: 'The 7 Best Natural Ingredients for Your Hair',
    img: 'blog-item-img-1',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
  {
    header: 'How To Get Healthy Hair: Healthy Hair Tips',
    img: 'blog-item-img-2',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
  {
    header: 'Hair Styles to Complete Your Halloween Look',
    img: 'blog-item-img-3',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec',
  },
];

function BlogPost() {
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="App topOfPage">
      <div
        className="go-back-up-arrow"
        onClick={goToTop}
        style={{ display: showArrow ? 'block' : 'none' }}
      ></div>
      <Nav />
      <div className="section-wrap blog-post-wrap">
        <h2>5 SECRETS TO FRIZZ CONTROL FOR CURLY HAIR</h2>
        <h4>October 5th, 2017</h4>
        <div className="blog-post-header-img"></div>
        <div className="blog-post-body">
          <div className="blog-post-body-header">
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui.
            </p>
            <p>
              Far far away, behind the word mountains, far from the countries Vokalia and
              Consonantia, there live the blind texts. Separated they live in Bookmarksgrove
              right at the coast of the Semantics, a large language ocean. A small river named
              Duden flows by their place and supplies it with the necessary regelialia. It is a
              paradisematic country, in which roasted parts of sentences fly into your mouth.
              Even the all-powerful Pointing has no control about the.
            </p>
          </div>
          <div className="blog-post-countdown-wrap">
            <h3>1. FIRST AND FOREMOST, MOISTURIZE.</h3>
            <div className="blog-post-body-img blog-post-body-img-argan-oil"></div>
            <p>
              The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog.
              Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz,
              bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz
              whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting
              zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew
              my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax
              my big quiz. Quick, Baz, get my woven flax jodhpurs! &ldquo;Now fax quiz
              Jack!&rdquo; my brave ghost pled. Five quacking zephyrs jolt my wax bed.
              Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
              quisquam est, qui dolorem ipsum quia dolor sit.
            </p>
            <p>
              A wonderful serenity has taken possession of my entire soul, like these sweet
              mornings of spring which I enjoy with my whole heart. I am alone, and feel the
              charm of existence in this spot, which was created for the bliss of souls like
              mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere
              tranquil existence, that I neglect my talents. I should be incapable of drawing.
            </p>
            <p>
              Far far away, behind the word mountains, far from the countries Vokalia and
              Consonantia, there live the blind texts. Separated they live in Bookmarksgrove
              right at the coast of the Semantics, a large language ocean. A small river named
              Duden flows by their place and supplies it with the necessary regelialia.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui.
            </p>
          </div>
          <div className="blog-post-countdown-wrap">
            <h3>2. APPLY STYLING PRODUCT TO WET HAIR ONLY.</h3>
            <div className="blog-post-body-img blog-post-body-img-wet-hair"></div>
            <p>
              The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog.
              Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz,
              bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz
              whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting
              zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew
              my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax
              my big quiz. Quick, Baz, get my woven flax jodhpurs! &ldquo;Now fax quiz
              Jack!&rdquo; my brave ghost pled. Five quacking zephyrs jolt my wax bed.
              Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
              quisquam est, qui dolorem ipsum quia dolor sit.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui.
            </p>
            <p>
              A wonderful serenity has taken possession of my entire soul, like these sweet
              mornings of spring which I enjoy with my whole heart. I am alone, and feel the
              charm of existence in this spot, which was created for the bliss of souls like
              mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere
              tranquil existence, that I neglect my talents. I should be incapable of drawing.
            </p>
            <p>
              Far far away, behind the word mountains, far from the countries Vokalia and
              Consonantia, there live the blind texts. Separated they live in Bookmarksgrove
              right at the coast of the Semantics, a large language ocean. A small river named
              Duden flows by their place and supplies it with the necessary regelialia.
            </p>
          </div>
          <div className="blog-post-countdown-wrap">
            <h3>3. DON&apos;T COMB HAIR AND DON&apos;T TOUCH WHILE DRYING!</h3>
            <div className="blog-post-body-img blog-post-body-img-comb"></div>
            <p>
              The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog.
              Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz,
              bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz
              whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting
              zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew
              my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax
              my big quiz. Quick, Baz, get my woven flax jodhpurs! &ldquo;Now fax quiz
              Jack!&rdquo; my brave ghost pled. Five quacking zephyrs jolt my wax bed.
              Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
              quisquam est, qui dolorem ipsum quia dolor sit.
            </p>
            <p>
              A wonderful serenity has taken possession of my entire soul, like these sweet
              mornings of spring which I enjoy with my whole heart. I am alone, and feel the
              charm of existence in this spot, which was created for the bliss of souls like
              mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere
              tranquil existence, that I neglect my talents. I should be incapable of drawing.
            </p>
            <p>
              Far far away, behind the word mountains, far from the countries Vokalia and
              Consonantia, there live the blind texts. Separated they live in Bookmarksgrove
              right at the coast of the Semantics, a large language ocean. A small river named
              Duden flows by their place and supplies it with the necessary regelialia.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui.
            </p>
          </div>
          <div className="blog-post-countdown-wrap">
            <h3>
              2. DON&apos;T BLOW-DRY, UNLESS YOU&apos;RE DIFFUSING, AND DON&apos;T OVERDO
              THAT.
            </h3>
            <div className="blog-post-body-img blog-post-body-img-wet-hair"></div>
            <p>
              The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog.
              Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz,
              bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz
              whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting
              zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew
              my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax
              my big quiz. Quick, Baz, get my woven flax jodhpurs! &ldquo;Now fax quiz
              Jack!&rdquo; my brave ghost pled. Five quacking zephyrs jolt my wax bed.
              Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
              quisquam est, qui dolorem ipsum quia dolor sit.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
              voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui.
            </p>
            <p>
              A wonderful serenity has taken possession of my entire soul, like these sweet
              mornings of spring which I enjoy with my whole heart. I am alone, and feel the
              charm of existence in this spot, which was created for the bliss of souls like
              mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere
              tranquil existence, that I neglect my talents. I should be incapable of drawing.
            </p>
            <p>
              Far far away, behind the word mountains, far from the countries Vokalia and
              Consonantia, there live the blind texts. Separated they live in Bookmarksgrove
              right at the coast of the Semantics, a large language ocean. A small river named
              Duden flows by their place and supplies it with the necessary regelialia.
            </p>
          </div>
        </div>
      </div>
      <div className="blog-wrap">
        <div className="section-wrap blog-post-bottom-item-wrap">
          {relatedBlogItems.map((blogItem, index) => {
            const blogItemBackgroundClasses = `blog-post-bottom-item-img ${blogItem.img}`;
            return (
              <div key={blogItem.header + index} className="blog-post-bottom-item">
                <h1>{blogItem.header}</h1>
                <div className={blogItemBackgroundClasses}></div>
                <p>{blogItem.description} ...</p>
                <a href="/blog-post">Read More</a>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BlogPost;
