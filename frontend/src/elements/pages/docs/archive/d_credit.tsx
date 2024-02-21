import React from 'react';
import {Stack, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';

function Dcredit() {
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <h2>Developers</h2>
        <div className='table-cover'>
          <Table className='table-narrow'>
            <tbody>
            <tr>
              <td className='fw-bold'>현창운 (30th)</td>
              <td>Ion 개발 담당</td>
            </tr>
            <tr>
              <td className='fw-bold'>이승원 (30th)</td>
              <td>서버 구축</td>
            </tr>
            <tr>
              <td className='fw-bold'>이나경 (30th)</td>
              <td>디자인</td>
            </tr>
            </tbody>
          </Table>
        </div>
        <p>Ion을 위해 가능한 모든 지원을 해주신 이지현 정보 선생님에게 특별한 감사의 말씀을 드립니다.</p>
        <Stack>
          <p>Project Ion GitHub: <Link to='https://github.com/miho73/ion'
                                       className='text-decoration-none'
                                       target='_black'>Link</Link></p>
          <p>
            <Link to='https://github.com/miho73/ion/issues' className='text-decoration-none'
                  target='_blank'>이슈</Link>
            <span> 등 Ion 개발과 오픈소스 기여와 관련된 사항은 GitHub에서 확인할 수 있습니다.</span>
          </p>
        </Stack>
      </Stack>

      <div>
        <h2>Managers</h2>
        <Table>
          <thead>
          <tr>
            <th>이름</th>
            <th>기수</th>
            <th>기간</th>
            <th>SNS</th>
            <td>GitHub</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>현창운</td>
            <td>30th</td>
            <td>2023 -</td>
            <td><Link className='text-decoration-none' to='https://www.instagram.com/iya.es/'
                      target='_blank'>@iya.es</Link></td>
            <td><Link className='text-decoration-none' to='https://github.com/miho73'
                      target='_blank'>miho73</Link></td>
          </tr>
          <tr>
            <td>이승원</td>
            <td>30th</td>
            <td>2023 -</td>
            <td><Link className='text-decoration-none' to='https://www.instagram.com/thislife_won/'
                      target='_blank'>@thislife_won</Link></td>
            <td><Link className='text-decoration-none' to='https://github.com/sw8744'
                      target='_blank'>sw8744</Link></td>
          </tr>
          </tbody>
        </Table>
      </div>
    </Stack>
  );
}

export default Dcredit
