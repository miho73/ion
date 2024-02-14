import React from 'react';
import {Container, ListGroup, ListGroupItem, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

function Dintro() {
    return (
        <Container className='nst'>
            <p className='fs-4 fw-bold'>이 문서는 Ion의 시스템에 대해 구체적으로 설명합니다.</p>
            <ListGroup as='ul' className='mb-4'>
                <ListGroupItem as='li' className='fw-bold fs-5'>IonID</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#createionid'>IonID 생성</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#activateionid'>IonID 활성화</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#iforgot'>IonID 복구</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#updatescode'>학번 업데이트</ListGroupItem>
                <ListGroupItem as='li' className='fw-bold fs-5'>면학 불참</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#nsrequest'>면불 신청</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#nsaprv'>면불 승인 / 거절</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#lns'>노트북실 면불 신청</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#nscancel'>면불 취소 / 변경</ListGroupItem>
                <ListGroupItem as='li' className='fw-bold fs-5'>급식 확인</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#checkmeal'>급식 확인</ListGroupItem>
                <ListGroupItem as='li' className='fw-bold fs-5'>물 온도 확인</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#watertemp'>한강물 / 인천 앞바다</ListGroupItem>
                <ListGroupItem as='li' className='fw-bold fs-5'>메인 페이지</ListGroupItem>
                <ListGroupItem as='a' className='ps-5' href='#wallpaper'>메인 페이지 배경</ListGroupItem>
            </ListGroup>
            <hr/>
            <Row className='my-3'>
                <p className='fw-bold fs-2 my-1'>IonID</p>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='createionid'>IonID 생성</p>
                    <p>IonID는 IonID 만들기 페이지에서 생성할 수 있습니다.</p>
                </Row>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='activateionid'>IonID 활성화</p>
                    <p>새롭게 만들어진 IonID는 기본적으로 "Inactivated" 상태이며 로그인할 수 없습니다. 교사가 IonID를 확인한 후 사용할 수 있도록 활성화한 후 IonID를
                        사용할 수 있습니다.</p>
                </Row>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='iforgot'>IonID 복구</p>
                    <p>IonID의 암호를 잊어버린 경우 IonID 복구를 통해 암호를 재설정할 수 있습니다. 암호를 재설정하려면 다음 단계를 따릅니다.</p>
                    <ol>
                        <li><Link to={'/auth/iforgot'}>IonID 복구</Link>로 이동합니다.</li>
                        <li>복구하고자 하는 IonID를 입력합니다.</li>
                        <li>IonID에 등록된 이름과 학번을 입력합니다.</li>
                        <li>이동되는 페이지의 안내를 읽고 개인 확인 코드를 기억합니다.</li>
                        <li>학년부장 선생님께 암호 재설정 신청을 승인해달라고 부탁드립니다.</li>
                        <li>선생님께 받은 암호 재설정 링크로 접속해서 암호를 재설정합니다.</li>
                    </ol>
                    <p>암호 재설정 신청은 하루동안 유효하며 하루 이내에 승인을 받고 암호를 받아야 합니다. 이미 신청된 재설정 신청은 취소, 변경할 수 없습니다.</p>
                    <p>개인 확인 코드는 암호 재설정 링크를 통해 암호를 변경하는 사람이 IonID를 소유하고 암호 재설정을 신청한 본인이 맞는지 확인하기 위해 사용됩니다. 개인 확인
                        코드는 딱 한 번만 볼 수 있으므로 잘 기억하거나 안전하지만 비밀스러운 곳에 메모해주세요. 개인 확인 코드를 분실하면 암호를 변경할 수 없습니다.</p>
                </Row>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='updatescode'>학번 업데이트</p>
                    <p>Ion에 로그인한 후 학번을 변경하도록 요구받을 수 있습니다. 주로 학년이 바뀐 후 이러한 요구를 받습니다. 새로운 반과 번호를 입력하고 확인하면 로그인이 완료됩니다.</p>
                    <p>학년 정보는 Ion에서 자동으로 처리한 정보를 사용합니다. 새로운 반과 번호만 입력하면 됩니다.</p>
                </Row>
            </Row>
            <Row className='my-3'>
                <p className='fw-bold fs-2 my-1'>면학 불참</p>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='nsrequest'>면불 신청</p>
                    <p><Link to='/ns'>면불 신청 페이지</Link>에서 면불을 신청할 수 있습니다. 면불을 신청하려면 다음 4가지 내용을 기입해야 합니다. 면불은 당일의 것만 신청할 수
                        있습니다.</p>
                    <ul>
                        <li>면학 시간 (8면, 1면, 2면)</li>
                        <li>장소</li>
                        <li>담당교사</li>
                        <li>신청사유</li>
                    </ul>
                    <p>만약 같은 내용으로 여러번 면불 신청을 하는 경우 면불 신청 내용을 저장하고 자동 완성할 수 있습니다. "장소", "담당교사", "신청사유"를 작성하고 자동완성 스위치를
                        켜세요. 면불 신청 관련 내용이 저장되며 앞으로 자동 완성됩니다. 저장된 내용을 삭제하려면 자동완성 스위치를 끄세요.</p>
                    <p>면불이 승인되려면 담당교사가 필요하며 담당교사에 입력된 모든 교사가 면불을 확인하고 승인할 수 있습니다. 만약 입력된 면불을 승인할 수 있는 담당교사가 존재하지 않는다면
                        면불의 상태는 "NO SUPERVISOR"가 됩니다. 이 경우 면불을 삭제하고 올바른 정보로 다시 신청해야 합니다.</p>
                </Row>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='nsaprv'>면불 승인 / 거절</p>
                    <p>신청된 면불은 "REQUESTED" 상태입니다. 담당교사는 신청된 면불을 확인하고 이를 승인하거나 거절할 수 있습니다. 면불 신청의 승인 / 거절 상황은 <Link
                        to='/ns'>면불 신청 페이지</Link>의 면불 신청 목록에서 확인할 수 있습니다.</p>
                    <p>"APPROVED" 상태가 아닌 "REQUESTED" 상태 또는 "DENIED" 상태인 면불은 승인되지 않은 것으로 사감 선생님이 확인할 수 없습니다. 면학이 시작되기 전에
                        면불 상태가 "APPROVED"가 되어야 면불을 뺄 수 있습니다.</p>
                </Row>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='lns'>노트북실 면불 신청</p>
                    <p>노트북실로 면불을 신청하고자 하는 경우 면불 신청과 함께 노트북실(aka. 노면실) 자리를 예약해야 합니다. 노트북실 자리를 예약하려면 "노트북실 자리 예약" 체크박스를
                        체크하세요.</p>
                    <p>자리를 예약할 시간대를 선택하면 현재 예약상황이 표시됩니다. 이미 예약된 자리에는 예약한 사람의 학번과 이름이 표시됩니다. 그렇지 않은 자리는 자리의 번호가 표시됩니다.
                        원하는 자리를 클릭해서 선택하세요. 자리를 선택하고 면불 신청을 제출하면 노트북실이 예약됩니다. 노트북실 예약은 당일의 것만 가능합니다.</p>
                    <p>노트북실을 여러 시간동안 연속으로 사용하고자 하는 경우 공통자리를 찾을 수 있습니다. 예약 페이지의 가장 아래에서 공통자리를 찾고자 하는 시간대를 모두 선택하세요. 선택한
                        시간대에 공통으로 비어있는 자리를 찾아 하이라이트합니다.</p>
                </Row>
                <Row className='mb-2'>
                    <p className='my-1 fw-bold fs-4 my-1' id='nscancel'>면불 취소 / 변경</p>
                    <p>기존에 신청된 면불 신청은 수정할 수 없습니다. 만약 면불 신청과 관련된 사항을 변경해야 할 경우 기존에 신청된 면불 신청을 취소하고 다시 신청해야 합니다. 면불 신청은
                        다음과 같은 방법으로 취소합니다.</p>
                    <div className='border p-3'>
                        <ol>
                            <li><Link to='/ns'>면불 신청 페이지</Link>로 이동합니다.</li>
                            <li>면불 신청 목록에서 삭제하고자 하는 면불 신청을 확인합니다.</li>
                            <li>오른쪽 끝의 'X' 버튼을 누르고 취소를 확인합니다.</li>
                        </ol>
                    </div>
                    <p>면불을 취소하고 다시 신청하면 다시 담당교사의 승인을 받아야 합니다.</p>
                </Row>
            </Row>
            <Row className='my-3'>
                <p className='fw-bold fs-4 my-1' id='checkmeal'>급식 확인</p>
                <p>급식 정보는 <Link to='https://open.neis.go.kr/portal/mainPage.do'>나이스 교육정보 개방 포털</Link>에서 가져옵니다. 정보는 매일
                    첫번째 요청이 들어올 때 갱신되며 그 시점에 공개된 정보를 하루동안 제공합니다.</p>
                <p>급식 정보 제공 서비스에서는 다음 정보를 제공합니다.</p>
                <ul>
                    <li>식단</li>
                    <li>열량</li>
                </ul>
            </Row>
            <Row className='my-3'>
                <p className='fw-bold fs-4 my-1' id='watertemp'>물 온도 확인</p>
                <ul>
                    <li><Link to='/etc/temperature/hangang' target='_blank'>한강 수온</Link></li>
                    <li><Link to='/etc/temperature/incheon' target='_blank'>인천 앞바다 수온</Link></li>
                </ul>
                <p>Ion은 한강(중량천)과 인천 앞 바다(인천 조위관측소)에서 측정한 수온 정보를 제공합니다. 한강 수온 정보의 출처는 <Link
                    to='https://data.seoul.go.kr/' target='_blank'>서울 열린데이터 광장</Link>이고 인천 앞바다 수온 정보의 출처는 <Link
                    to='http://www.khoa.go.kr/oceangrid/khoa/intro.do' target='_blank'>바다누리 해양정보 서비스</Link>입니다.</p>
                <p>수온 데이터는 매 시간 갱신되며 갱신 시점 출처에서 제공한 정보 중 최신 정보를 사용합니다.</p>
            </Row>
            <Row className='my-3'>
                <p className='fw-bold fs-4 my-1' id='wallpaper'>메인 페이지 배경</p>
                <p>메인 페이지에서 사용하는 배경사진과 설명은 <Link to='https://apod.nasa.gov/apod/astropix.html' target='_blank'>NASA
                    APOD</Link>(Astronomy Picture of the Day)에서 가져옵니다. 사진은 매일 첫번째 요청이 들어올 때 갱신되며 그 시점에 APOD에 개제된 최신 사진을
                    하루동안 사용합니다.</p>
            </Row>
        </Container>
    );
}

export default Dintro
